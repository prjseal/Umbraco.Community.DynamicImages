using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Media;

public interface IDynamicImageMediaWriter
{
    /// <summary>
    /// Saves a rendered image into the media library and returns its key.
    /// <para>
    /// When <paramref name="existingMediaKey"/> names a media item this package can reuse, the
    /// file is replaced in place and the same key comes back - so the MediaPicker reference on the
    /// content, and any URL already shared, stay valid.
    /// </para>
    /// </summary>
    Task<Guid> WriteAsync(
        Image image,
        Template template,
        string contentName,
        Guid? existingMediaKey,
        CancellationToken cancellationToken = default);

    /// <summary>Encodes a rendered image in the template's output format.</summary>
    Task<byte[]> EncodeAsync(Image image, OutputSettings output, CancellationToken cancellationToken = default);

    /// <summary>The file extension matching an output format, including the leading dot.</summary>
    string ExtensionFor(OutputFormat format);

    /// <summary>The MIME type matching an output format.</summary>
    string ContentTypeFor(OutputFormat format);
}
