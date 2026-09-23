import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbMoveRepository, UmbMoveToRequestArgs } from "@umbraco-cms/backoffice/tree";
import { moveFolder, moveTemplate, type TokenGetter } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";

/** Core's move repository, less the generated client: move, then say so. */
abstract class DiMoveRepositoryBase extends UmbRepositoryBase implements UmbMoveRepository, UmbApi {
  protected abstract move(key: string, targetKey: string | null, getToken: TokenGetter): Promise<void>;

  async requestMoveTo(args: UmbMoveToRequestArgs) {
    const { error } = await diExecute(this, (token) => this.move(args.unique, args.destination.unique, token));

    if (!error) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message: "Moved" } });
    }

    return { error };
  }
}

export class DiMoveTemplateRepository extends DiMoveRepositoryBase {
  protected move = moveTemplate;
}

export class DiMoveTemplateFolderRepository extends DiMoveRepositoryBase {
  protected move = moveFolder;
}
