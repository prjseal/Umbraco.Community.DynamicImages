import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbMoveRepository, UmbMoveToRequestArgs } from "@umbraco-cms/backoffice/tree";
import { moveFolder, moveTemplate, type TokenGetter } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_ROOT_ENTITY_TYPE } from "../../tree/constants.js";

/**
 * Core's move repository, less the generated client: move, then say so - and reload the
 * destination. Core's move action reloads only where the item came from (its own code carries a
 * "TODO: Reload destination"), so the moved item would vanish from the tree until a refresh.
 */
abstract class DiMoveRepositoryBase extends UmbRepositoryBase implements UmbMoveRepository, UmbApi {
  protected abstract move(key: string, targetKey: string | null, getToken: TokenGetter): Promise<void>;

  async requestMoveTo(args: UmbMoveToRequestArgs) {
    const { error } = await diExecute(this, (token) => this.move(args.unique, args.destination.unique, token));

    if (!error) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message: "Moved" } });

      const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
      const destination = args.destination.unique;
      events?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
        entityType: destination ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ROOT_ENTITY_TYPE,
        unique: destination,
      }));
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
