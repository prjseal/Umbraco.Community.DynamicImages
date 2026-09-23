import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import { UmbEntityCreateOptionActionBase } from "@umbraco-cms/backoffice/entity-create-option-action";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { fetchFontTreeItems, notifyTemplatesChanged } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_FONT_UPLOAD_MODAL, type FontUploadData, type FontUploadMode } from "../../modals/tokens.js";
import { DI_FONT_FAMILY_ENTITY_TYPE } from "../constants.js";

/**
 * The Fonts tree's Create… options that add a font: each opens the upload modal on its own way in,
 * placed where the create was started - a folder or the root, where the server finds or makes a
 * family by name, or a family, whose "Add variant" locks the new variants to it.
 */
abstract class DiAddFontOptionAction extends UmbEntityCreateOptionActionBase {
  protected abstract readonly mode: FontUploadMode | undefined;

  override async execute() {
    const unique = this.args.unique ?? null;
    const data: FontUploadData = { mode: this.mode };

    if (this.args.entityType === DI_FONT_FAMILY_ENTITY_TYPE && unique) {
      const { data: items } = await diExecute(this, (token) => fetchFontTreeItems([unique], token));
      data.familyKey = unique;
      data.familyName = items?.[0]?.name;
    } else {
      data.parentKey = unique;
    }

    const result = await umbOpenModal(this, DI_FONT_UPLOAD_MODAL, { data });
    if (!result?.uploaded) return;

    const notifications = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notifications?.peek("positive", { data: { message: "Font added" } });
    if (result.warnings?.length) {
      notifications?.peek("warning", { data: { headline: "Some variants were not added", message: result.warnings.join(" ") } });
    }

    const events = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
    events?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({ entityType: this.args.entityType, unique }));
    notifyTemplatesChanged();
  }
}

export class DiUploadFontOptionAction extends DiAddFontOptionAction {
  protected readonly mode = "upload" as const;
}

export class DiWebFontOptionAction extends DiAddFontOptionAction {
  protected readonly mode = "web" as const;
}

export class DiPathFontOptionAction extends DiAddFontOptionAction {
  protected readonly mode = "path" as const;
}

/** A family's "Add variant": all three ways in, locked to the family. */
export class DiAddVariantOptionAction extends DiAddFontOptionAction {
  protected readonly mode = undefined;
}
