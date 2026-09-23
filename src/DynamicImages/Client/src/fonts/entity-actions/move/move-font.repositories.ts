import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import type { UmbBulkMoveToRepository, UmbBulkMoveToRequestArgs } from "@umbraco-cms/backoffice/entity-bulk-action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbMoveRepository, UmbMoveToRequestArgs } from "@umbraco-cms/backoffice/tree";
import { bulkMoveFonts, moveFontFamily, moveFontFolder, type TokenGetter } from "../../../api/dynamic-images-api.js";
import { diExecute } from "../../../api/di-execute.js";
import { DI_FONT_FOLDER_ENTITY_TYPE, DI_FONT_ROOT_ENTITY_TYPE } from "../../constants.js";

/**
 * The Fonts tree's moves, as `entity-actions/move/move.repositories.ts` is the Templates tree's:
 * move, say so, and reload the destination, which core's move action leaves alone.
 */
abstract class DiFontMoveBase extends UmbRepositoryBase implements UmbApi {
  protected async moved(destination: string | null, message?: string) {
    if (message) {
      const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
      notifications?.peek("positive", { data: { message } });
    }

    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
    events?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: destination ? DI_FONT_FOLDER_ENTITY_TYPE : DI_FONT_ROOT_ENTITY_TYPE,
      unique: destination,
    }));
  }
}

abstract class DiFontMoveRepository extends DiFontMoveBase implements UmbMoveRepository {
  protected abstract move(key: string, targetKey: string | null, getToken: TokenGetter): Promise<void>;

  async requestMoveTo(args: UmbMoveToRequestArgs) {
    const destination = args.destination.unique;
    const { error } = await diExecute(this, (token) => this.move(args.unique, destination, token));
    if (!error) await this.moved(destination, "Moved");
    return { error };
  }
}

export class DiMoveFontFamilyRepository extends DiFontMoveRepository {
  protected move = moveFontFamily;
}

export class DiMoveFontFolderRepository extends DiFontMoveRepository {
  protected move = moveFontFolder;
}

/** Over `PUT fonts/tree/bulk-move`: folders and families, each checked as its own move would be. */
export class DiBulkMoveFontsRepository extends DiFontMoveBase implements UmbBulkMoveToRepository {
  async requestBulkMoveTo(args: UmbBulkMoveToRequestArgs) {
    const destination = args.destination.unique;
    const { error } = await diExecute(this, (token) => bulkMoveFonts(args.uniques, destination, token));

    // A partial failure is a 400 naming what stayed; the rest did move.
    await this.moved(destination, error ? undefined : `Moved ${args.uniques.length} item${args.uniques.length === 1 ? "" : "s"}`);

    return { error };
  }
}
