import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import type { UmbBulkDuplicateToRepository, UmbBulkDuplicateToRequestArgs, UmbBulkMoveToRepository, UmbBulkMoveToRequestArgs } from "@umbraco-cms/backoffice/entity-bulk-action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { bulkDuplicate, bulkMove } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_TEMPLATE_FOLDER_ENTITY_TYPE, DI_TEMPLATE_ROOT_ENTITY_TYPE } from "../../tree/constants.js";

const plural = (count: number, one: string) => `${count} ${one}${count === 1 ? "" : "s"}`;

/**
 * Core's bulk actions reload the collection they ran from; these reload the destination too, as
 * the single-item move and duplicate repositories do.
 */
abstract class DiBulkRepositoryBase extends UmbRepositoryBase implements UmbApi {
  protected async reloadDestination(destination: string | null) {
    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT).catch(() => undefined);
    events?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: destination ? DI_TEMPLATE_FOLDER_ENTITY_TYPE : DI_TEMPLATE_ROOT_ENTITY_TYPE,
      unique: destination,
    }));
  }

  protected async notify(color: "positive" | "warning", message: string) {
    const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notifications?.peek(color, { data: { message } });
  }
}

/** Over `PUT tree/bulk-move`: folders and templates, each checked as its own move would be. */
export class DiBulkMoveTemplatesRepository extends DiBulkRepositoryBase implements UmbBulkMoveToRepository {
  async requestBulkMoveTo(args: UmbBulkMoveToRequestArgs) {
    const destination = args.destination.unique;
    const { error } = await diExecute(this, (token) => bulkMove(args.uniques, destination, token));

    // A partial failure is a 400 whose detail names each item that stayed; the others did move.
    await this.reloadDestination(destination);
    if (!error) await this.notify("positive", `Moved ${plural(args.uniques.length, "item")}`);

    return { error };
  }
}

/** Over `POST templates/bulk-duplicate`. Folders in the selection are skipped and named. */
export class DiBulkDuplicateTemplatesRepository extends DiBulkRepositoryBase implements UmbBulkDuplicateToRepository {
  async requestBulkDuplicateTo(args: UmbBulkDuplicateToRequestArgs) {
    const destination = args.destination.unique;
    const { data, error } = await diExecute(this, (token) => bulkDuplicate(args.uniques, destination, token));
    if (!data) return { error };

    await this.reloadDestination(destination);

    if (data.created.length > 0) await this.notify("positive", `Copied ${plural(data.created.length, "template")}`);
    if (data.skippedFolders.length > 0) {
      await this.notify("warning", `Folders are not copied: ${data.skippedFolders.join(", ")}`);
    }
    if (data.errors.length > 0) await this.notify("warning", data.errors.join(" "));

    return {};
  }
}
