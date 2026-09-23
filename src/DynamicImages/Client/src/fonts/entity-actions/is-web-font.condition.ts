import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type {
  UmbConditionConfigBase, UmbConditionControllerArguments, UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_ENTITY_CONTEXT } from "@umbraco-cms/backoffice/entity";
import { fetchFontTreeItems } from "../../api/dynamic-images-api.js";
import { diExecute } from "../../api/di-execute.js";

/**
 * Permits an action on a variant fetched from the web - Google, Bunny or a URL. It reads the item
 * the action is for from the entity context, which the tree item and each collection row provide.
 */
export class DiIsWebFontCondition extends UmbConditionBase<UmbConditionConfigBase> implements UmbExtensionCondition {
  constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbConditionConfigBase>) {
    super(host, args);

    this.consumeContext(UMB_ENTITY_CONTEXT, (context) => {
      this.observe(context?.unique, async (unique) => {
        if (!unique) {
          this.permitted = false;
          return;
        }

        const { data } = await diExecute(this, (token) => fetchFontTreeItems([unique], token));
        this.permitted = data?.[0]?.isUrlFont ?? false;
      });
    });
  }
}

export { DiIsWebFontCondition as api };
