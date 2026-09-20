import { css } from "@umbraco-cms/backoffice/external/lit";

/**
 * "There is nothing here", drawn the same way on every surface an editor checks their work on:
 * the designer's viewport, the Preview tab's render and the preview strip's thumbnail. Without it
 * behind the two rendered images, a transparent render reads as a *white* render - which is the
 * one thing transparency must not look like.
 *
 * The colours are hard-coded because a checkerboard has to read as nothing in both the light and
 * the dark backoffice theme, and no UUI token means that.
 */
export const checkerboard = css`
  background-color: #26262b;
  background-image:
    linear-gradient(45deg, #303036 25%, transparent 25%),
    linear-gradient(-45deg, #303036 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #303036 75%),
    linear-gradient(-45deg, transparent 75%, #303036 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
`;
