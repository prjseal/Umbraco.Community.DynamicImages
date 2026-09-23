import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import type { UmbEntityReferenceRepository, UmbReferenceItemModel } from "@umbraco-cms/backoffice/relations";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { fetchFontReferences, fetchFontsAreReferenced } from "../../../api/dynamic-images-api.js";
import { diExecute } from "../../../api/di-execute.js";
import { DI_TEMPLATE_ENTITY_TYPE } from "../../../tree/constants.js";
import { mapFontItem } from "../item/font-item.repository.js";

/** A template that uses a font, as the delete modal lists it: drawn by the `di-template` item ref. */
export interface DiTemplateReferenceModel extends UmbReferenceItemModel {
  unique: string;
  name: string;
  isEnabled: boolean;
}

/**
 * What `deleteWithRelation` shows before a font or family is deleted: the templates using it. A
 * family's references are every variant's. Templates are the only thing that references a font.
 */
export class DiFontReferenceRepository extends UmbRepositoryBase implements UmbEntityReferenceRepository, UmbApi {
  async requestReferencedBy(unique: string, skip = 0, take = 20) {
    const { data, error } = await diExecute(this, (token) => fetchFontReferences(unique, skip, take, token));
    if (!data) return { error };

    const items: DiTemplateReferenceModel[] = data.items.map((template) => ({
      entityType: DI_TEMPLATE_ENTITY_TYPE,
      unique: template.key,
      name: template.name,
      isEnabled: template.isEnabled,
    }));

    return { data: { total: data.total, items } };
  }

  /** Which of a bulk selection is in use - the fonts themselves, which the bulk modal names. */
  async requestAreReferenced(uniques: Array<string>, skip = 0, take = 20) {
    const { data, error } = await diExecute(this, (token) => fetchFontsAreReferenced(uniques, skip, take, token));
    if (!data) return { error };

    return { data: { total: data.total, items: data.items.map(mapFontItem) } };
  }
}

export { DiFontReferenceRepository as api };
