using SixLabors.ImageSharp;
using Umbraco.Community.DynamicImages.Core.Models;
// Aliased: Umbraco.Cms.Core.Models also has a Template, and this file's Template is the package's.
using IContent = Umbraco.Cms.Core.Models.IContent;

namespace Umbraco.Community.DynamicImages.Core.Media;

public interface IDynamicImageMediaWriter
{
    /// <summary>
    /// Saves a rendered image into the media library and returns its key.
    /// <para>
    /// When <paramref name="existingMediaKey"/> names a media item this package generated for
    /// <paramref name="content"/>, the file is replaced in place and the same key comes back - so
    /// the MediaPicker reference on the content, and any URL already shared, stay valid. Anything
    /// else it names - an editor's hand-picked hero, a shared logo - is left alone and a new
    /// media item is created instead.
    /// </para>
    /// <para>
    /// The whole <see cref="IContent"/> rather than its name, because the ownership marker is a
    /// relation between the document and the media item.
    /// </para>
    /// </summary>
    Task<Guid> WriteAsync(
        Image image,
        Template template,
        IContent content,
        Guid? existingMediaKey,
        CancellationToken cancellationToken = default);

    /// <summary>Encodes a rendered image in the template's output format.</summary>
    Task<byte[]> EncodeAsync(Image image, OutputSettings output, CancellationToken cancellationToken = default);

    /// <summary>The file extension matching an output format, including the leading dot.</summary>
    string ExtensionFor(OutputFormat format);

    /// <summary>The MIME type matching an output format.</summary>
    string ContentTypeFor(OutputFormat format);
}
