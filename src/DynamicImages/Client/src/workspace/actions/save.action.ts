import { UmbSubmitWorkspaceAction } from "@umbraco-cms/backoffice/workspace";

/**
 * The standard submit action. Umbraco's own implementation already does exactly what is needed -
 * call requestSubmit() on the workspace context and manage the button's state - so there is
 * nothing to add.
 */
export { UmbSubmitWorkspaceAction as api };
export default UmbSubmitWorkspaceAction;
