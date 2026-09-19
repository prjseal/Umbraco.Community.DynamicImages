using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Community.DynamicImages.Api.Models;
using Umbraco.Community.DynamicImages.Core.Services;

namespace Umbraco.Community.DynamicImages.Api.Controllers;

public class FontsController(IFontService fontService) : DynamicImagesControllerBase
{
    /// <summary>Uploaded font files are small; the cap keeps a stray upload from filling memory.</summary>
    private const long MaxUploadBytes = 10 * 1024 * 1024;

    [HttpGet("fonts")]
    [ProducesResponseType(typeof(IReadOnlyList<FontResponse>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
        => Ok(fontService.GetAll()
            .Select(font => FontResponse.From(font, fontService.TemplatesUsing(font.Key).Count))
            .ToList());

    [HttpPost("fonts")]
    [RequestSizeLimit(MaxUploadBytes)]
    [ProducesResponseType(typeof(FontResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload(IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return Problem(title: "No file", detail: "Choose a .ttf, .otf or .woff2 file to upload.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        await using var stream = file.OpenReadStream();
        var result = await fontService.UploadAsync(stream, file.FileName, cancellationToken);

        return result.Font is null
            ? Problem(title: "That font could not be added", detail: result.Error, statusCode: StatusCodes.Status400BadRequest)
            : Created($"fonts/{result.Font.Key}", FontResponse.From(result.Font, 0));
    }

    [HttpPost("fonts/register-path")]
    [ProducesResponseType(typeof(FontResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterPath([FromBody] RegisterFontPathRequest request, CancellationToken cancellationToken)
    {
        var result = await fontService.RegisterPathAsync(request.Path, cancellationToken);

        return result.Font is null
            ? Problem(title: "That font could not be registered", detail: result.Error, statusCode: StatusCodes.Status400BadRequest)
            : Created($"fonts/{result.Font.Key}", FontResponse.From(result.Font, 0));
    }

    [HttpPut("fonts/{key:guid}")]
    [ProducesResponseType(typeof(FontResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Update(Guid key, [FromBody] UpdateFontRequest request)
    {
        var font = fontService.Update(key, request.FamilyName, request.Styles);

        return font is null
            ? FontNotFound(key)
            : Ok(FontResponse.From(font, fontService.TemplatesUsing(key).Count));
    }

    [HttpDelete("fonts/{key:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Delete(Guid key)
    {
        if (fontService.Get(key) is null) return FontNotFound(key);

        var inUse = fontService.Delete(key);
        if (inUse.Count == 0) return Ok();

        // Naming the templates is the whole point of the 409 - "in use" alone leaves the editor
        // hunting through every design for the layer that still references it.
        return Problem(
            title: "That font is still in use",
            detail: $"Remove it from {string.Join(", ", inUse.Select(t => $"'{t.Name}'"))} first.",
            statusCode: StatusCodes.Status409Conflict);
    }

    /// <summary>
    /// The raw font file, for the designer's FontFace loader. A @font-face URL cannot carry a
    /// bearer token, so the client fetches the bytes itself and registers them.
    /// </summary>
    [HttpGet("fonts/{key:guid}/file")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status304NotModified)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFile(Guid key, CancellationToken cancellationToken)
    {
        var file = await fontService.GetFileAsync(key, cancellationToken);
        if (file is null) return FontNotFound(key);

        var (bytes, contentType, etag) = file.Value;

        if (!string.IsNullOrWhiteSpace(etag))
        {
            var quoted = $"\"{etag}\"";
            if (Request.Headers.IfNoneMatch.Contains(quoted)) return StatusCode(StatusCodes.Status304NotModified);

            Response.Headers.ETag = quoted;
        }

        return File(bytes, contentType);
    }

    private IActionResult FontNotFound(Guid key)
        => Problem(title: "Font not found", detail: $"No font exists with the key {key}.",
            statusCode: StatusCodes.Status404NotFound);
}
