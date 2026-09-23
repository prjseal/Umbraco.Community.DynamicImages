import {
  UmbWorkspaceActionBase,
  type MetaWorkspaceAction,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { cancelJob, regenerateTemplate } from "../../api/dynamic-images-api.js";
import { pollRegenerationJob } from "../../api/regeneration-job.js";

/**
 * Regenerates every node this template applies to. The server queues the work and returns a job
 * id; this polls it, so a run over several hundred nodes does not hold a request open.
 */
export class DiRegenerateWorkspaceAction extends UmbWorkspaceActionBase<MetaWorkspaceAction> {
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #context?: DiTemplateWorkspaceContext;

  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<MetaWorkspaceAction>) {
    super(host, args);

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notificationContext = context;
    });
    this.consumeContext(DI_TEMPLATE_WORKSPACE_CONTEXT, (context) => {
      this.#context = context;
    });
  }

  override async execute(): Promise<void> {
    const context = this.#context;
    const template = context?.getData();
    if (!context || !template) return;

    if (context.getIsNew()) {
      this.#notificationContext?.peek("warning", { data: { message: "Save the template before regenerating." } });
      return;
    }

    await umbConfirmModal(this._host, {
      headline: `Regenerate every image for '${template.name}'?`,
      content:
        "Each node's existing image file is replaced in place, so links keep working. This can take a while on a large site.",
      confirmLabel: "Regenerate",
      color: "warning",
    });

    try {
      const job = await regenerateTemplate(template.key, false, context.getToken);

      this.#notificationContext?.peek("positive", {
        data: { message: `Regenerating ${job.total} item(s)…` },
      });

      await pollRegenerationJob(job, context.getToken, this.#notificationContext);
    } catch (error) {
      this.#notificationContext?.peek("danger", {
        data: {
          headline: "Regeneration could not be started",
          message: error instanceof Error ? error.message : "",
        },
      });
    }
  }

  /** Exposed so a future progress UI can stop a long run; the endpoint already supports it. */
  async cancel(jobId: string): Promise<void> {
    if (this.#context) await cancelJob(jobId, this.#context.getToken);
  }
}

export { DiRegenerateWorkspaceAction as api };
export default DiRegenerateWorkspaceAction;
