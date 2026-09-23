import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { exportTemplate, fetchTemplate } from "../api/dynamic-images-api.js";
import { diExecute } from "../api/di-execute.js";

/** Export JSON on a template: downloads `<alias>.json`, the file Import JSON reads back. */
export class DiExportTemplateEntityAction extends UmbEntityActionBase<never> {
  override async execute() {
    const key = this.args.unique;
    if (!key) return;

    const { data, error } = await diExecute(this, async (token) => ({
      blob: await exportTemplate(key, token),
      alias: (await fetchTemplate(key, token)).alias,
    }));
    if (error || !data) throw error ?? new Error("The template could not be exported.");

    const url = URL.createObjectURL(data.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.alias}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export { DiExportTemplateEntityAction as api };
