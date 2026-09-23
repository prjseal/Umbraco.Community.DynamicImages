import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbEntityActionBase, UmbRequestReloadStructureForEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { fetchTreeItems, notifyTemplatesChanged, setTemplateEnabled } from "../api/dynamic-images-api.js";
import { diExecute } from "../api/di-execute.js";

/**
 * Enable and Disable in a template's ⋯, shown together the way Publish and Unpublish are. Either
 * one on a template already in that state does nothing and says so, as core's publish does on a
 * published node.
 */
export abstract class DiSetTemplateEnabledEntityAction extends UmbEntityActionBase<never> {
  protected abstract readonly enable: boolean;

  override async execute() {
    const key = this.args.unique;
    if (!key) return;

    const { data, error } = await diExecute(this, (token) => setTemplateEnabled(key, this.enable, token));
    if (error || !data) throw error ?? new Error("The template could not be changed.");

    const { data: items } = await diExecute(this, (token) => fetchTreeItems([key], token));
    const name = items?.[0]?.name ?? "The template";
    const state = this.enable ? "enabled" : "disabled";

    const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    if (!data.changed) {
      notifications?.peek("default", { data: { message: `'${name}' is already ${state}` } });
      return;
    }

    notifications?.peek("positive", { data: { message: `'${name}' ${state}` } });

    // Reloads the parent's children, which redraws this item's icon, and any collection showing it.
    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
    events?.dispatchEvent(new UmbRequestReloadStructureForEntityEvent({ unique: key, entityType: this.args.entityType }));
    notifyTemplatesChanged();
  }
}

export class DiEnableTemplateEntityAction extends DiSetTemplateEnabledEntityAction {
  protected readonly enable = true;
}

export { DiEnableTemplateEntityAction as api };
