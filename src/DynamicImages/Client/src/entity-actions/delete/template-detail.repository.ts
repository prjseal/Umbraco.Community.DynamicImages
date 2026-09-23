import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbDetailRepositoryBase, type UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbEntityModel } from "@umbraco-cms/backoffice/entity";
import { deleteFolder, deleteTemplate, fetchTemplate, fetchTreeItems } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";
import { DI_TEMPLATE_ENTITY_TYPE } from "../../tree/constants.js";

/**
 * The slice of a template the `delete` entity action and bulk action kinds need. Creating and editing a template
 * is the template workspace's job, through its own context, so those halves are refused here
 * rather than duplicated.
 */
export interface DiTemplateDetailModel extends UmbEntityModel {
  unique: string;
  name: string;
}

export const DI_TEMPLATE_DETAIL_STORE_CONTEXT = new UmbContextToken<DiTemplateDetailStore>("DiTemplateDetailStore");

export class DiTemplateDetailStore extends UmbDetailStoreBase<DiTemplateDetailModel> {
  constructor(host: UmbControllerHost) {
    super(host, DI_TEMPLATE_DETAIL_STORE_CONTEXT);
  }
}

const notHere = () => Promise.resolve({ error: new Error("Templates are created and edited in the template workspace.") });

class DiTemplateDetailServerDataSource implements UmbDetailDataSource<DiTemplateDetailModel> {
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  createScaffold = notHere;
  create = notHere;
  update = notHere;

  async read(unique: string) {
    const { data, error } = await diExecute(this.#host, (token) => fetchTemplate(unique, token));
    if (!data) return { error };

    return { data: { entityType: DI_TEMPLATE_ENTITY_TYPE, unique: data.key, name: data.name } };
  }

  /**
   * A template, or a folder: the collection's bulk Delete sends every selected key here, and a
   * selection can hold both. A folder that is not empty is refused by the server with a 409, which
   * core's bulk action shows as that item's error.
   */
  delete(unique: string) {
    return diExecute(this.#host, async (token) => {
      const [item] = await fetchTreeItems([unique], token);
      return item?.entityType === "folder" ? deleteFolder(unique, token) : deleteTemplate(unique, token);
    });
  }
}

export class DiTemplateDetailRepository extends UmbDetailRepositoryBase<DiTemplateDetailModel> implements UmbApi {
  constructor(host: UmbControllerHost) {
    super(host, DiTemplateDetailServerDataSource, DI_TEMPLATE_DETAIL_STORE_CONTEXT);
  }
}

export { DiTemplateDetailRepository as api };
