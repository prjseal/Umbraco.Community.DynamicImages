import { DiSetTemplateEnabledEntityAction } from "./enable-template.action.js";

/** Disable in a template's ⋯: the template stops generating images until it is enabled again. */
export class DiDisableTemplateEntityAction extends DiSetTemplateEnabledEntityAction {
  protected readonly enable = false;
}

export { DiDisableTemplateEntityAction as api };
