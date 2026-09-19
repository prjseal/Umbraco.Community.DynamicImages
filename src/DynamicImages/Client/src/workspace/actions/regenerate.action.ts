import {
  UmbWorkspaceActionBase,
  type MetaWorkspaceAction,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { DI_TEMPLATE_WORKSPACE_CONTEXT, type DiTemplateWorkspaceContext } from "../di-template-workspace.context.js";
import { cancelJob, fetchJob, regenerateTemplate } from "../../api/dynamic-images-api.js";
import type { DiJob } from "../../api/types.js";

/** How often to ask the server how the bulk job is getting on. */
const POLL_INTERVAL_MS = 1500;

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

      await this.#poll(job, context);
    } catch (error) {
      this.#notificationContext?.peek("danger", {
        data: {
          headline: "Regeneration could not be started",
          message: error instanceof Error ? error.message : "",
        },
      });
    }
  }

  async #poll(job: DiJob, context: DiTemplateWorkspaceContext): Promise<void> {
    let current = job;

    while (current.status === "queued" || current.status === "running") {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      try {
        current = await fetchJob(current.id, context.getToken);
      } catch {
        // The job store is in-memory: a restart loses it, and there is nothing useful to retry.
        this.#notificationContext?.peek("warning", { data: { message: "Lost track of the regeneration job." } });
        return;
      }
    }

    if (current.status === "completed") {
      const failures = current.failures.length;

      this.#notificationContext?.peek(failures > 0 ? "warning" : "positive", {
        data: {
          headline: "Regeneration finished",
          message: `${current.generated} generated, ${current.skipped} skipped${failures > 0 ? `, ${failures} failed` : ""}.`,
        },
      });

      for (const failure of current.failures.slice(0, 3)) {
        this.#notificationContext?.peek("danger", { data: { message: failure } });
      }
    } else {
      this.#notificationContext?.peek("danger", {
        data: { headline: `Regeneration ${current.status}`, message: current.failures[0] ?? "" },
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
