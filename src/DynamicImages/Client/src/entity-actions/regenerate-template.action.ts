import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { fetchTreeItems, regenerateTemplate } from "../api/dynamic-images-api.js";
import { diExecute } from "../api/di-execute.js";
import { pollRegenerationJob } from "../api/regeneration-job.js";

/** Regenerate all, from a template's ⋯ menu: the workspace action, without opening the template. */
export class DiRegenerateTemplateEntityAction extends UmbEntityActionBase<never> {
  override async execute() {
    const key = this.args.unique;
    if (!key) return;

    const { data: items } = await diExecute(this, (token) => fetchTreeItems([key], token));
    const name = items?.[0]?.name ?? "this template";

    await umbConfirmModal(this, {
      headline: `Regenerate every image for '${name}'?`,
      content:
        "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning",
    });

    const { data: job, error } = await diExecute(this, (token) => regenerateTemplate(key, false, token));
    if (error || !job) throw error ?? new Error("Regeneration could not be started.");

    const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notifications?.peek("positive", { data: { message: `Regenerating ${job.total} item(s)…` } });

    const auth = await this.getContext(UMB_AUTH_CONTEXT);
    await pollRegenerationJob(job, () => auth?.getLatestToken(), notifications);
  }
}

export { DiRegenerateTemplateEntityAction as api };
