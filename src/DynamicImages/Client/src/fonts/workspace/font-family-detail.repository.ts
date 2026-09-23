import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbEntityModel } from "@umbraco-cms/backoffice/entity";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbDetailRepositoryBase, type UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import { deleteFontFamily, fetchFontFamily, renameFontFamily } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_FONT_FAMILY_ENTITY_TYPE } from "../constants.js";

/** A family as its workspace edits it: the name, which is all a family has of its own. */
export interface DiFontFamilyDetailModel extends UmbEntityModel {
  unique: string;
  name: string;
}

export const DI_FONT_FAMILY_DETAIL_STORE_CONTEXT = new UmbContextToken<DiFontFamilyDetailStore>("DiFontFamilyDetailStore");

export class DiFontFamilyDetailStore extends UmbDetailStoreBase<DiFontFamilyDetailModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_FONT_FAMILY_DETAIL_STORE_CONTEXT);
  }
}

/** A family is made by adding its first variant, so there is no create here. */
const notHere = () => Promise.resolve({ error: new Error("A font family is created by adding a font.") });

class DiFontFamilyServerDataSource implements UmbDetailDataSource<DiFontFamilyDetailModel> {
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  createScaffold = notHere;
  create = notHere;

  async read(unique: string) {
    const { data, error } = await diExecute(this.#host, (token) => fetchFontFamily(unique, token));
    if (!data) return { error };

    return { data: { entityType: DI_FONT_FAMILY_ENTITY_TYPE, unique: data.key, name: data.name } };
  }

  /** A rename: the server carries it onto every variant's family name. */
  async update(model: DiFontFamilyDetailModel) {
    const { error } = await diExecute(this.#host, (token) => renameFontFamily(model.unique, model.name, token));
    return error ? { error } : this.read(model.unique);
  }

  delete(unique: string) {
    return diExecute(this.#host, (token) => deleteFontFamily(unique, token));
  }
}

export class DiFontFamilyDetailRepository extends UmbDetailRepositoryBase<DiFontFamilyDetailModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiFontFamilyServerDataSource, DI_FONT_FAMILY_DETAIL_STORE_CONTEXT);
  }
}

export { DiFontFamilyDetailRepository as api };
