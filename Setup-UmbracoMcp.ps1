<#
.SYNOPSIS
    One-shot setup for the Umbraco MCP server in an existing Umbraco project.

.DESCRIPTION
    Run this after Umbraco itself is installed. By default it edits files
    and registers the MCP server. Use -DryRun to inspect the changes first.

    Phases:
      1. Discovers the Umbraco web project (folder containing both
         appsettings.Development.json and Properties/launchSettings.json).
      2. Adds the uSync.Command.Setup PackageReference (CPM-aware) if missing.
      3. Adds the uSync.Command block to appsettings.Development.json if missing.
      4. Runs `claude mcp add umbraco-mcp -s project ...` from the script
         root (where this script runs from), writing a .mcp.json there.

    After running this script, start the site once (F5 or `dotnet run`) so
    uSync.Command.Setup creates the API user in Umbraco. The MCP server will
    use those credentials whenever Claude Code connects to it.

.PARAMETER DryRun
    Print what would be added to each file, plus the MCP command, without
    writing anything or invoking claude. Defaults to false.

.PARAMETER ProjectPath
    Path to the Umbraco web project folder. Defaults to src\DynamicImages.TestSite.Clean
    (this repo has two web projects, so auto-discovery would be ambiguous).

.PARAMETER SearchRoot
    Where to start auto-discovery. Defaults to the folder this script lives in.

.PARAMETER PackageVersion
    Version of uSync.Command.Setup to pin.

.PARAMETER ApiUserName / ApiUserEmail / ClientId
    Values used when the uSync.Command block has to be created.

.PARAMETER ToolCollections
    Comma-separated list passed as UMBRACO_INCLUDE_TOOL_COLLECTIONS.

.PARAMETER SkipSetup
    Skip the package/appsettings phase. Use to (re)build the MCP command only.

.EXAMPLE
    .\scripts\Setup-UmbracoMcp.ps1 -DryRun

.EXAMPLE
    .\scripts\Setup-UmbracoMcp.ps1
#>
[CmdletBinding()]
param(
    [switch]$DryRun,
    [string]$ProjectPath = (Join-Path $PSScriptRoot 'src\DynamicImages.TestSite.Clean'),
    [string]$SearchRoot = $PSScriptRoot,
    [string]$PackageVersion = '17.0.0',
    [string]$ApiUserName = 'Demo API User',
    [string]$ApiUserEmail = 'demo-api@example.com',
    [string]$ClientId = 'umbraco-back-office-demo-api-user',
    [string]$ToolCollections = 'document,media,document-type,data-type',
    [switch]$SkipSetup
)

$ErrorActionPreference = 'Stop'

# ---------- helpers ----------

function Find-UmbracoProject {
    param([string]$Root)
    $excludeDirs = @('bin', 'obj', 'node_modules', '.git', 'wwwroot')
    Get-ChildItem -Path $Root -Recurse -File `
            -Filter 'appsettings.Development.json' -ErrorAction SilentlyContinue |
        Where-Object {
            $parts = $_.FullName.Split([IO.Path]::DirectorySeparatorChar)
            -not ($parts | Where-Object { $excludeDirs -contains $_ })
        } |
        Where-Object {
            Test-Path (Join-Path $_.DirectoryName 'Properties\launchSettings.json')
        } |
        Select-Object -ExpandProperty DirectoryName -Unique
}

function Find-DirectoryPackagesProps {
    param([string]$StartPath)
    $current = Get-Item -LiteralPath $StartPath
    while ($current) {
        $candidate = Join-Path $current.FullName 'Directory.Packages.props'
        if (Test-Path $candidate) { return $candidate }
        if (-not $current.Parent) { return $null }
        $current = $current.Parent
    }
    return $null
}

function New-RandomSecret {
    param([int]$Length = 16)
    $chars = (48..57) + (65..90) + (97..122)
    -join (1..$Length | ForEach-Object { [char]($chars | Get-Random) })
}

function Add-PackageReferenceToCsproj {
    param([string]$CsprojPath, [string]$Package, [string]$Version, [bool]$VersionInline, [bool]$DryRun)
    [xml]$doc = Get-Content -LiteralPath $CsprojPath -Raw
    $existing = $doc.SelectNodes("//PackageReference[@Include='$Package']")
    if ($existing.Count -gt 0) { return @{ Added = $false; Existing = $existing[0] } }
    $verAttr = if ($VersionInline) { " Version=`"$Version`"" } else { '' }
    $snippet = "<PackageReference Include=`"$Package`"$verAttr />"
    if ($DryRun) { return @{ Added = $true; Snippet = $snippet } }

    $itemGroup = $doc.SelectSingleNode("//ItemGroup[PackageReference]")
    if (-not $itemGroup) {
        $itemGroup = $doc.CreateElement('ItemGroup')
        $doc.Project.AppendChild($itemGroup) | Out-Null
    }
    $node = $doc.CreateElement('PackageReference')
    $node.SetAttribute('Include', $Package)
    if ($VersionInline) { $node.SetAttribute('Version', $Version) }
    $itemGroup.AppendChild($node) | Out-Null
    $doc.Save($CsprojPath)
    return @{ Added = $true; Snippet = $snippet }
}

function Add-PackageVersionToProps {
    param([string]$PropsPath, [string]$Package, [string]$Version, [bool]$DryRun)
    [xml]$doc = Get-Content -LiteralPath $PropsPath -Raw
    $existing = $doc.SelectNodes("//PackageVersion[@Include='$Package']")
    if ($existing.Count -gt 0) { return @{ Added = $false; Existing = $existing[0] } }
    $snippet = "<PackageVersion Include=`"$Package`" Version=`"$Version`" />"
    if ($DryRun) { return @{ Added = $true; Snippet = $snippet } }

    $itemGroup = $doc.SelectSingleNode("//ItemGroup[PackageVersion]")
    if (-not $itemGroup) { $itemGroup = $doc.SelectSingleNode("//ItemGroup") }
    if (-not $itemGroup) {
        $itemGroup = $doc.CreateElement('ItemGroup')
        $doc.Project.AppendChild($itemGroup) | Out-Null
    }
    $node = $doc.CreateElement('PackageVersion')
    $node.SetAttribute('Include', $Package)
    $node.SetAttribute('Version', $Version)
    $itemGroup.AppendChild($node) | Out-Null
    $doc.Save($PropsPath)
    return @{ Added = $true; Snippet = $snippet }
}

function Get-HttpsLaunchUrl {
    param([string]$LaunchSettingsPath)
    $launch = Get-Content -LiteralPath $LaunchSettingsPath -Raw | ConvertFrom-Json
    $profile = $launch.profiles.PSObject.Properties |
        Where-Object { $_.Value.applicationUrl } |
        Select-Object -First 1
    if (-not $profile) { throw "No profile with applicationUrl found in $LaunchSettingsPath" }
    $url = ($profile.Value.applicationUrl -split ';') |
        Where-Object { $_ -like 'https://*' } |
        Select-Object -First 1
    if (-not $url) { throw "No https:// applicationUrl found in profile '$($profile.Name)'" }
    return $url.TrimEnd('/')
}

function Write-DryRunSnippet {
    param([string]$FilePath, [string]$Snippet)
    Write-Host "          would add to $FilePath" -ForegroundColor DarkGray
    foreach ($line in ($Snippet -split "`r?`n")) {
        Write-Host "            $line" -ForegroundColor DarkCyan
    }
}

# ---------- phase 1: discover ----------

if ($DryRun) {
    Write-Host "DRY RUN: no files will be written and no command will be invoked." -ForegroundColor Magenta
    Write-Host ""
}

if (-not $ProjectPath) {
    Write-Host "Searching for Umbraco project under: $SearchRoot" -ForegroundColor DarkGray
    $candidates = @(Find-UmbracoProject -Root $SearchRoot)
    if ($candidates.Count -eq 0) {
        throw "No Umbraco project (appsettings.Development.json + Properties\launchSettings.json) found under '$SearchRoot'. Pass -ProjectPath."
    }
    if ($candidates.Count -gt 1) {
        $list = ($candidates | ForEach-Object { "  - $_" }) -join "`n"
        throw "Found more than one candidate project. Re-run with -ProjectPath set to one of:`n$list"
    }
    $ProjectPath = $candidates[0]
}
Write-Host "Project: $ProjectPath" -ForegroundColor Cyan

$csprojFile = Get-ChildItem -Path $ProjectPath -Filter '*.csproj' -File | Select-Object -First 1
if (-not $csprojFile) { throw "No .csproj found in '$ProjectPath'." }

$appSettingsPath    = Join-Path $ProjectPath 'appsettings.Development.json'
$launchSettingsPath = Join-Path $ProjectPath 'Properties\launchSettings.json'

Write-Host "csproj : $($csprojFile.FullName)" -ForegroundColor DarkGray

# Effective credentials used for the MCP command at the end. These are
# either read from the existing appsettings or generated in phase 2.
$effectiveClientId = $null
$effectiveSecret   = $null

# ---------- phase 2: setup (package + appsettings) ----------

if (-not $SkipSetup) {

    $propsPath = Find-DirectoryPackagesProps -StartPath $ProjectPath
    $cpmEnabled = $false
    if ($propsPath) {
        [xml]$propsXml = Get-Content -LiteralPath $propsPath -Raw
        $flag = $propsXml.SelectSingleNode("//ManagePackageVersionsCentrally")
        if ($flag -and $flag.InnerText.Trim().ToLower() -eq 'true') {
            $cpmEnabled = $true
            Write-Host "props  : $propsPath (CPM enabled)" -ForegroundColor DarkGray
        }
    }

    $packageName = 'uSync.Command.Setup'
    $refResult = Add-PackageReferenceToCsproj `
        -CsprojPath $csprojFile.FullName `
        -Package $packageName `
        -Version $PackageVersion `
        -VersionInline (-not $cpmEnabled) `
        -DryRun ([bool]$DryRun)

    if ($refResult.Added) {
        if ($DryRun) {
            Write-Host "[csproj]  Would add PackageReference '$packageName':" -ForegroundColor Magenta
            Write-DryRunSnippet -FilePath $csprojFile.FullName -Snippet $refResult.Snippet
        } else {
            Write-Host "[csproj]  Added: $($refResult.Snippet)" -ForegroundColor Green
        }
    } else {
        $ver = $refResult.Existing.Version
        if ($ver) {
            Write-Host "[csproj]  PackageReference '$packageName' already present (Version=$ver)." -ForegroundColor Yellow
        } else {
            Write-Host "[csproj]  PackageReference '$packageName' already present." -ForegroundColor Yellow
        }
    }

    if ($cpmEnabled) {
        $verResult = Add-PackageVersionToProps `
            -PropsPath $propsPath `
            -Package $packageName `
            -Version $PackageVersion `
            -DryRun ([bool]$DryRun)

        if ($verResult.Added) {
            if ($DryRun) {
                Write-Host "[props]   Would add PackageVersion '$packageName':" -ForegroundColor Magenta
                Write-DryRunSnippet -FilePath $propsPath -Snippet $verResult.Snippet
            } else {
                Write-Host "[props]   Added: $($verResult.Snippet)" -ForegroundColor Green
            }
        } else {
            Write-Host "[props]   PackageVersion '$packageName' already present (Version=$($verResult.Existing.Version))." -ForegroundColor Yellow
        }
    }

    $json = Get-Content -LiteralPath $appSettingsPath -Raw | ConvertFrom-Json
    if ($json.PSObject.Properties.Name -contains 'uSync' -and $json.uSync.PSObject.Properties.Name -contains 'Command') {
        Write-Host "[json]    uSync.Command block already present in appsettings.Development.json." -ForegroundColor Yellow
        $effectiveClientId = $json.uSync.Command.ClientId
        $effectiveSecret   = $json.uSync.Command.Secret
    } else {
        $effectiveSecret   = New-RandomSecret -Length 16
        $effectiveClientId = $ClientId
        $commandObj = [pscustomobject][ordered]@{
            AddIfMissing = $true
            Name         = $ApiUserName
            Username     = $ApiUserEmail
            Email        = $ApiUserEmail
            Secret       = $effectiveSecret
            ClientId     = $ClientId
        }
        $blockJson = $commandObj | ConvertTo-Json -Depth 16

        if ($DryRun) {
            Write-Host "[json]    Would add uSync.Command block:" -ForegroundColor Magenta
            Write-DryRunSnippet -FilePath $appSettingsPath -Snippet $blockJson
            Write-Host "          (Secret shown here is generated for preview; a fresh one is produced on the real run.)" -ForegroundColor DarkGray
        } else {
            if ($json.PSObject.Properties.Name -contains 'uSync') {
                $json.uSync | Add-Member -MemberType NoteProperty -Name Command -Value $commandObj -Force
            } else {
                $uSyncObj = [pscustomobject]@{ Command = $commandObj }
                $json | Add-Member -MemberType NoteProperty -Name uSync -Value $uSyncObj -Force
            }
            ($json | ConvertTo-Json -Depth 32) | Set-Content -LiteralPath $appSettingsPath -Encoding UTF8
            Write-Host "[json]    Added uSync.Command block (Secret: $effectiveSecret)." -ForegroundColor Green
        }
    }
} else {
    Write-Host "Skipping setup (-SkipSetup)." -ForegroundColor DarkGray
}

# Fall back to whatever is on disk for the MCP command if phase 2 didn't populate.
if (-not $effectiveSecret -or -not $effectiveClientId) {
    $jsonNow = Get-Content -LiteralPath $appSettingsPath -Raw | ConvertFrom-Json
    if ($jsonNow.uSync -and $jsonNow.uSync.Command) {
        if (-not $effectiveClientId) { $effectiveClientId = $jsonNow.uSync.Command.ClientId }
        if (-not $effectiveSecret)   { $effectiveSecret   = $jsonNow.uSync.Command.Secret }
    }
}

# ---------- phase 3: build & maybe run the MCP add command ----------

Write-Host ""
Write-Host "Building MCP add command..." -ForegroundColor Cyan

if ([string]::IsNullOrWhiteSpace($effectiveClientId) -or [string]::IsNullOrWhiteSpace($effectiveSecret)) {
    throw "Could not resolve uSync.Command.ClientId / Secret from $appSettingsPath."
}

$baseUrl = Get-HttpsLaunchUrl -LaunchSettingsPath $launchSettingsPath

# Argument array used for the actual invocation. Each token is passed verbatim
# to claude, so the `--` separator and `KEY=VALUE` env pairs reach it intact.
# `-s project` writes a .mcp.json into the current working directory, so we
# invoke claude with cwd = the script root below (where this script runs from).
$claudeArgs = @(
    'mcp', 'add', 'umbraco-mcp', '-s', 'project',
    '--env', "UMBRACO_CLIENT_ID=$effectiveClientId",
    '--env', "UMBRACO_CLIENT_SECRET=$effectiveSecret",
    '--env', "UMBRACO_BASE_URL=$baseUrl",
    '--env', 'NODE_TLS_REJECT_UNAUTHORIZED=0',
    '--env', "UMBRACO_INCLUDE_TOOL_COLLECTIONS=$ToolCollections",
    '--', 'npx', '@umbraco-cms/mcp-dev@lts-17'
)

# Display string matches the form in the Umbraco docs so it's copy/paste-ready.
$displayCommand = (@(
    'claude mcp add umbraco-mcp -s project'
    "--env UMBRACO_CLIENT_ID=`"$effectiveClientId`""
    "--env UMBRACO_CLIENT_SECRET=`"$effectiveSecret`""
    "--env UMBRACO_BASE_URL=`"$baseUrl`""
    '--env NODE_TLS_REJECT_UNAUTHORIZED="0"'
    "--env UMBRACO_INCLUDE_TOOL_COLLECTIONS=`"$ToolCollections`""
    '-- npx @umbraco-cms/mcp-dev@lts-17'
) -join ' ')

Write-Host ""
if ($DryRun) {
    Write-Host 'Would run:' -ForegroundColor Magenta
} else {
    Write-Host 'Generated command:' -ForegroundColor Cyan
}
Write-Host $displayCommand
Write-Host ""

# Write the .mcp.json at the root where this script runs from, not in the
# discovered project subfolder. Fall back to the current location if the
# script root can't be resolved (e.g. when dot-sourced interactively).
$mcpConfigDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

if (-not $DryRun) {
    Write-Host "Running from: $mcpConfigDir" -ForegroundColor Yellow
    Push-Location -LiteralPath $mcpConfigDir
    try {
        & claude @claudeArgs
        $claudeExit = $LASTEXITCODE
        if ($claudeExit -ne 0) {
            throw "claude mcp add failed with exit code $claudeExit. Nothing was registered."
        }
        Write-Host ""
        Write-Host "Verifying registration..." -ForegroundColor DarkGray
        $listed = & claude mcp list 2>&1
        if ($listed -match 'umbraco-mcp') {
            Write-Host "umbraco-mcp is registered." -ForegroundColor Green
        } else {
            Write-Host "Warning: claude mcp list did not show umbraco-mcp. Output was:" -ForegroundColor Red
            $listed | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
        }
    } finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "Next step: start the site once (F5 or 'dotnet run') so uSync.Command.Setup creates the API user." -ForegroundColor Cyan

exit 0
