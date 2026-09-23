import type { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { fetchJob, type TokenGetter } from "./dynamic-images-api.js";
import type { DiJob } from "./types.js";

/** How often to ask the server how the bulk job is getting on. */
const POLL_INTERVAL_MS = 1500;

/**
 * Follows a regeneration job to the end and reports the outcome. Shared by the workspace's
 * "Regenerate all" action and the tree's entity action of the same name. The server queues the
 * work and returns a job id, so a run over several hundred nodes does not hold a request open.
 */
export async function pollRegenerationJob(
  job: DiJob,
  getToken: TokenGetter,
  notifications: typeof UMB_NOTIFICATION_CONTEXT.TYPE | undefined,
): Promise<void> {
  let current = job;

  while (current.status === "queued" || current.status === "running") {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    try {
      current = await fetchJob(current.id, getToken);
    } catch {
      // The job store is in-memory: a restart loses it, and there is nothing useful to retry.
      notifications?.peek("warning", { data: { message: "Lost track of the regeneration job." } });
      return;
    }
  }

  if (current.status === "completed") {
    const failures = current.failures.length;

    notifications?.peek(failures > 0 ? "warning" : "positive", {
      data: {
        headline: "Regeneration finished",
        message: `${current.generated} generated, ${current.skipped} skipped${failures > 0 ? `, ${failures} failed` : ""}.`,
      },
    });

    for (const failure of current.failures.slice(0, 3)) {
      notifications?.peek("danger", { data: { message: failure } });
    }
  } else {
    notifications?.peek("danger", {
      data: { headline: `Regeneration ${current.status}`, message: current.failures[0] ?? "" },
    });
  }
}
