import {
  UmbPropertyActionBase,
  type MetaPropertyAction,
  type UmbPropertyActionArgs,
} from "@umbraco-cms/backoffice/property-action";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UMB_PROPERTY_CONTEXT } from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { DiApiError, regenerateDocument } from "../api/dynamic-images-api.js";

/**
 * "Regenerate OG image" in a media picker's … menu, on the property the template writes to.
 *
 * A property action rather than a custom property editor UI on purpose: adopting the package then
 * needs no data type changes on anyone's existing document types.
 */
export class DiRegeneratePropertyAction extends UmbPropertyActionBase<MetaPropertyAction> {
  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #propertyContext?: typeof UMB_PROPERTY_CONTEXT.TYPE;
  #documentUnique?: string;

  constructor(host: UmbControllerHost, args: UmbPropertyActionArgs<MetaPropertyAction>) {
    super(host, args);

    this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
      this.#authContext = context;
    });
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notificationContext = context;
    });
    this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
      this.#propertyContext = context;
    });
    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.#documentUnique = context?.getUnique() ?? undefined;
    });
  }

  override async execute(): Promise<void> {
    if (!this.#documentUnique) {
      this.#notificationContext?.peek("warning", { data: { message: "Save this page before regenerating its image." } });
      return;
    }

    try {
      const result = await regenerateDocument(this.#documentUnique, () => this.#authContext?.getLatestToken());

      // Writing the value straight back into the property means the editor sees the new image
      // without reloading the page.
      if (result.propertyValue) {
        this.#propertyContext?.setValue(JSON.parse(result.propertyValue));
      }

      // "generateddraft" is a success: the image was written and saved to the draft, but the
      // page was not published - either it had edits the editor has not released, or they may
      // update it and not publish it. The server's message says which, so it is shown as it is.
      this.#notificationContext?.peek("positive", {
        data: {
          headline: "Dynamic Images",
          message: result.message ?? "The image has been regenerated.",
        },
      });
    } catch (error) {
      const isMissingTemplate = error instanceof DiApiError && error.status === 404;

      this.#notificationContext?.peek(isMissingTemplate ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message:
            error instanceof DiApiError ? error.detail ?? error.message : "The image could not be regenerated.",
        },
      });
    }
  }
}

export { DiRegeneratePropertyAction as api };
export default DiRegeneratePropertyAction;
