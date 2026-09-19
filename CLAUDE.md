# Working in this repository

## Toolchain

The remote container has no .NET SDK. **Always install it via bash at the start of a session**
before any build or test, with the official script (the project targets `net10.0`):

```bash
curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
bash /tmp/dotnet-install.sh --channel 10.0 --install-dir "$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH" DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
```

Shell state does not persist between commands, so prefix each `dotnet` command with that
`export`, or call `$HOME/.dotnet/dotnet` directly. Then:

- `dotnet build src/DynamicImages.sln`
- `dotnet test test/DynamicImages.Tests`
- Client: `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test && npm run build`
  (the built bundle under `wwwroot/App_Plugins/DynamicImages/` is committed; the release
  workflow has no npm step).

## Plans

Feature work is planned before it is implemented, and the two happen in separate sessions.

- **A planning session's deliverable is a plan file in `plans/`.** Name it
  `<feature>-plan.md` in kebab-case (for example `plans/web-fonts-plan.md`) and commit it to the
  session's branch. Follow the structure of the plans already there: Context (including the
  decisions made with the user and any library facts verified), Design, Files (new, modified,
  reused as-is), Implementation order, Verification. A planning session does not implement.
- **Once the plan is written, approved and placed in `plans/`**, end the session by telling the
  user which model should implement it, with a one-line reason, and giving a ready-to-paste
  prompt for that implementation session in a fenced code block. The prompt names the plan file
  and how to verify the work.
- **An implementation session starts by reading its plan from `plans/`** and follows it. Where
  the code forces a different choice, say so in the commit message and update the plan so it
  still describes what was built.
