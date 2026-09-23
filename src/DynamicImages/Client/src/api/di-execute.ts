import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UmbContextConsumerController } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { DiApiError, type TokenGetter } from "./dynamic-images-api.js";

/**
 * Runs one of this package's hand-written API calls the way core runs a generated one: through
 * `tryExecute`, so a failure comes back as `{ error }` and raises the backoffice's own error
 * notification. The repositories and data sources the tree, collection and entity actions need
 * are all shaped around that `{ data, error }` contract.
 *
 * A `DiApiError` is rethrown as a ProblemDetails-like object, which is what `tryExecute` knows how
 * to turn into a notification carrying the server's title and detail - "The folder is not empty"
 * rather than "Unknown error".
 */
export async function diExecute<T>(
  host: UmbControllerHost,
  call: (getToken: TokenGetter) => Promise<T>,
): Promise<{ data?: T; error?: Error }> {
  const promise = (async () => {
    const auth = await new UmbContextConsumerController(host, UMB_AUTH_CONTEXT).asPromise().catch(() => undefined);

    try {
      return { data: await call(() => auth?.getLatestToken()) };
    } catch (error) {
      if (error instanceof DiApiError) {
        throw { type: "error", title: error.message, status: error.status, detail: error.detail };
      }
      throw error;
    }
  })();

  return (await tryExecute(host, promise)) as { data?: T; error?: Error };
}
