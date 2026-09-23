import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbId } from "@umbraco-cms/backoffice/id";
import type { UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import type { UmbFolderModel } from "@umbraco-cms/backoffice/tree";
import { createFolder, deleteFolder, fetchFolder, updateFolder } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_TEMPLATE_FOLDER_ENTITY_TYPE } from "../constants.js";

/**
 * A template folder over `folders/*`. Follows core's document type folder data source: the
 * scaffold chooses the key, and create and update read the folder back afterwards.
 */
export class DiTemplateFolderServerDataSource implements UmbDetailDataSource<UmbFolderModel> {
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async createScaffold(preset?: Partial<UmbFolderModel>) {
    const scaffold: UmbFolderModel = {
      entityType: DI_TEMPLATE_FOLDER_ENTITY_TYPE,
      unique: UmbId.new(),
      name: "",
      ...preset,
    };

    return { data: scaffold };
  }

  async read(unique: string) {
    if (!unique) throw new Error("Unique is missing");

    const { data, error } = await diExecute(this.#host, (token) => fetchFolder(unique, token));
    if (!data) return { error };

    return { data: { entityType: DI_TEMPLATE_FOLDER_ENTITY_TYPE, unique: data.key, name: data.name } as UmbFolderModel };
  }

  async create(model: UmbFolderModel, parentUnique: string | null) {
    if (!model.unique) throw new Error("Unique is missing");
    if (!model.name) throw new Error("Name is missing");

    const key = model.unique;
    const { error } = await diExecute(this.#host, (token) =>
      createFolder({ key, name: model.name, parentKey: parentUnique }, token));

    return error ? { error } : this.read(key);
  }

  async update(model: UmbFolderModel) {
    if (!model.unique) throw new Error("Unique is missing");
    if (!model.name) throw new Error("Folder name is missing");

    const key = model.unique;
    const { error } = await diExecute(this.#host, (token) => updateFolder(key, model.name, token));

    return error ? { error } : this.read(key);
  }

  async delete(unique: string) {
    if (!unique) throw new Error("Unique is missing");

    return diExecute(this.#host, (token) => deleteFolder(unique, token));
  }
}
