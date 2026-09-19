import {
  UmbEntityActionBase,
  type MetaEntityAction,
  type UmbEntityActionArgs,
} from "@umbraco-cms/backoffice/entity-action";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { DiApiError, regenerateDocument } from "../api/dynamic-images-api.js";

/**
 * "Regenerate OG image" in a document's Actions menu. Authorised by the weaker Regenerate policy,
 * so an editor who cannot open the Dynamic Images section can still refresh their own page's image.
 */
export class DiRegenerateDocumentEntityAction extends UmbEntityActionBase<MetaEntityAction> {
  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  constructor(host: UmbControllerHost, args: UmbEntityActionArgs<MetaEntityAction>) {
    super(host, args);

    this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
      this.#authContext = context;
    });
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notificationContext = context;
    });
  }

  override async execute(): Promise<void> {
    const unique = this.args.unique;
    if (!unique) return;

    try {
      const result = await regenerateDocument(unique, () => this.#authContext?.getLatestToken());

      this.#notificationContext?.peek(result.outcome === "generated" ? "positive" : "warning", {
        data: {
          headline: "Dynamic Images",
          message: result.outcome === "generated" ? "The image has been regenerated." : result.message ?? result.outcome,
        },
      });
    } catch (error) {
      // A 404 here is the ordinary "this document type has no template" case, not a fault.
      const isMissingTemplate = error instanceof DiApiError && error.status === 404;

      this.#notificationContext?.peek(isMissingTemplate ? "warning" : "danger", {
        data: {
          headline: "Dynamic Images",
          message:
            error instanceof DiApiError
              ? error.detail ?? error.message
              : "The image could not be regenerated.",
        },
      });
    }
  }
}

export { DiRegenerateDocumentEntityAction as api };
export default DiRegenerateDocumentEntityAction;
