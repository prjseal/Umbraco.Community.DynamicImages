import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import {
  TEMPLATES_CHANGED_EVENT, fetchHealth, fetchTemplates, hrefForCreate, hrefForTemplate,
  templateKeyFromLocation, type TokenGetter,
} from "../api/dynamic-images-api.js";
import type { DiHealthIssue, DiTemplateSummary } from "../api/types.js";

/**
 * "Templates" in the section sidebar, with one child per template. Deliberately not the full
 * tree/treeItem/repository/store stack - a handful of templates load in one call, and the menu
 * needs nothing a tree would give it.
 */
@customElement("di-templates-menu-item")
export class DiTemplatesMenuItemElement extends UmbLitElement {
  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;

  @state()
  private _templates: DiTemplateSummary[] = [];

  @state()
  private _issuesByTemplate = new Map<string, number>();

  @state()
  private _loading = true;

  @state()
  private _activeKey = templateKeyFromLocation();

  @state()
  private _expanded = true;

  constructor() {
    super();

    this.consumeContext(UMB_AUTH_CONTEXT, (instance) => {
      this.#authContext = instance;
      if (instance) void this.#load();
    });

    // "changestate" is what Umbraco's router-slot dispatches for in-app navigation; "popstate"
    // alone would only catch back/forward and miss every link click.
    window.addEventListener("changestate", this.#onRouteChange);
    window.addEventListener(TEMPLATES_CHANGED_EVENT, this.#onTemplatesChanged);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("changestate", this.#onRouteChange);
    window.removeEventListener(TEMPLATES_CHANGED_EVENT, this.#onTemplatesChanged);
  }

  #getToken: TokenGetter = () => this.#authContext?.getLatestToken();

  #onRouteChange = () => {
    this._activeKey = templateKeyFromLocation();
  };

  #onTemplatesChanged = () => {
    void this.#load();
  };

  async #load() {
    this._loading = true;

    try {
      // Health comes along for the ride so a template with a broken font carries a badge here,
      // rather than only revealing itself when someone opens it.
      const [templates, health] = await Promise.all([
        fetchTemplates(this.#getToken),
        fetchHealth(this.#getToken).catch(() => undefined),
      ]);

      this._templates = templates;
      this._issuesByTemplate = countIssues(health?.issues ?? []);
    } catch (error) {
      console.error("[DynamicImages] Failed to load the template list", error);
      this._templates = [];
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <uui-menu-item
        label="Templates"
        has-children
        ?loading=${this._loading}
        ?show-children=${this._expanded}
        @show-children=${() => {
          this._expanded = true;
        }}
        @hide-children=${() => {
          this._expanded = false;
        }}>
        <uui-icon slot="icon" name="icon-brush"></uui-icon>
        ${this.#renderChildren()}
      </uui-menu-item>
    `;
  }

  #renderChildren() {
    // The item's own `loading` indicator covers the collapsed case; this covers the expanded
    // one. Between them the sidebar never sits looking finished while it is still fetching -
    // which, with the section chrome now painting before the bundle loads, is the only part of
    // entering the section that can still look blank.
    if (this._loading) return html`<uui-loader></uui-loader>`;

    return html`
      ${repeat(
        this._templates,
        (template) => template.key,
        (template) => this.#renderTemplate(template),
      )}
      <uui-menu-item label="Create template" href=${hrefForCreate()}>
        <uui-icon slot="icon" name="icon-add"></uui-icon>
      </uui-menu-item>
    `;
  }

  #renderTemplate(template: DiTemplateSummary) {
    const issues = this._issuesByTemplate.get(template.key) ?? 0;

    return html`
      <uui-menu-item
        label=${template.name}
        href=${hrefForTemplate(template.key)}
        ?active=${template.key === this._activeKey}>
        <uui-icon
          slot="icon"
          name=${template.isEnabled ? "icon-picture" : "icon-block"}
          class=${template.isEnabled ? "enabled" : "disabled"}>
        </uui-icon>
        ${issues > 0
          ? html`<uui-badge slot="badge" color="warning" look="primary" title="${issues} issue(s)">${issues}</uui-badge>`
          : nothing}
      </uui-menu-item>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .disabled {
      opacity: 0.5;
    }

    .enabled {
      color: var(--uui-color-positive);
    }
  `;
}

/** Errors and warnings per template, for the menu badge. Issues with no template are site-wide. */
function countIssues(issues: DiHealthIssue[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const issue of issues) {
    if (!issue.templateKey || issue.severity === "info") continue;
    counts.set(issue.templateKey, (counts.get(issue.templateKey) ?? 0) + 1);
  }

  return counts;
}

export default DiTemplatesMenuItemElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-templates-menu-item": DiTemplatesMenuItemElement;
  }
}
