import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbEntityModel } from "@umbraco-cms/backoffice/entity";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbDetailRepositoryBase, type UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import { deleteFont, fetchFont, updateFont } from "../../api/dynamic-images-api.js";
import type { DiFont, DiFontStyle } from "../../api/types.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_FONT_ENTITY_TYPE } from "../constants.js";

const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium",
  600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black",
};

/** "Regular 400", "Bold 700 Italic" - the name the tree gives a variant (FontTree.VariantName). */
export function variantName(weight: number, isItalic: boolean): string {
  const named = WEIGHT_NAMES[weight];
  const name = named ? `${named} ${weight}` : String(weight);
  return isItalic ? `${name} Italic` : name;
}

/** A variant as its workspace edits it: the font row, named as the tree names it. */
export interface DiFontDetailModel extends UmbEntityModel {
  unique: string;
  name: string;
  font: DiFont;
  weight: number;
  isItalic: boolean;
  styles: DiFontStyle[];
}

export const DI_FONT_DETAIL_STORE_CONTEXT = new UmbContextToken<DiFontDetailStore>("DiFontDetailStore");

export class DiFontDetailStore extends UmbDetailStoreBase<DiFontDetailModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_FONT_DETAIL_STORE_CONTEXT);
  }
}

const notHere = () => Promise.resolve({ error: new Error("A font is added from the Fonts tree's Create….") });

export function toDetail(font: DiFont): DiFontDetailModel {
  return {
    entityType: DI_FONT_ENTITY_TYPE,
    unique: font.key,
    name: variantName(font.weight, font.isItalic),
    font,
    weight: font.weight,
    isItalic: font.isItalic,
    styles: font.styles,
  };
}

class DiFontServerDataSource implements UmbDetailDataSource<DiFontDetailModel> {
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  createScaffold = notHere;
  create = notHere;

  async read(unique: string) {
    const { data, error } = await diExecute(this.#host, (token) => fetchFont(unique, token));
    return data ? { data: toDetail(data) } : { error };
  }

  /** The named styles, weight and slant. The family name is the family's, so it goes back unchanged. */
  async update(model: DiFontDetailModel) {
    const { data, error } = await diExecute(this.#host, (token) =>
      updateFont(model.unique, model.font.familyName, model.styles, token, { weight: model.weight, isItalic: model.isItalic }));
    return data ? { data: toDetail(data) } : { error };
  }

  delete(unique: string) {
    return diExecute(this.#host, (token) => deleteFont(unique, token));
  }
}

export class DiFontDetailRepository extends UmbDetailRepositoryBase<DiFontDetailModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiFontServerDataSource, DI_FONT_DETAIL_STORE_CONTEXT);
  }
}

export { DiFontDetailRepository as api };
