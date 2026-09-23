import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbEntityActionBase, UmbRequestReloadStructureForEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { refreshFont } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { forgetFont } from "../../designer/fonts/font-face-loader.js";

/**
 * Refresh on a web font variant: re-resolves and re-downloads it from its provider. Shown only on
 * web fonts, by the IsWebFont condition.
 */
export class DiRefreshFontEntityAction extends UmbEntityActionBase<never> {
  override async execute() {
    const key = this.args.unique;
    if (!key) return;

    const { data, error } = await diExecute(this, (token) => refreshFont(key, token));
    if (error || !data) throw error ?? new Error("The font could not be refreshed.");

    // The loader is keyed by font key, not hash, so it has to forget the old bytes.
    forgetFont(key);

    const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notifications?.peek("positive", { data: { message: `'${data.familyName}' refreshed` } });

    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
    events?.dispatchEvent(new UmbRequestReloadStructureForEntityEvent({ unique: key, entityType: this.args.entityType }));
  }
}

export { DiRefreshFontEntityAction as api };
