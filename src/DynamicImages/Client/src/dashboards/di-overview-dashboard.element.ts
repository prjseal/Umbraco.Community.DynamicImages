import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestDashboard } from "@umbraco-cms/backoffice/dashboard";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
  TEMPLATES_CHANGED_EVENT, fetchFonts, fetchHealth, fetchTemplates, hrefForDashboard, hrefForWorkspace,
  type TokenGetter,
} from "../api/dynamic-images-api.js";
import { DI_TEMPLATE_ROOT_ENTITY_TYPE } from "../tree/constants.js";
import { DI_FONT_ROOT_ENTITY_TYPE } from "../fonts/constants.js";
import type { DiFont, DiHealthReport, DiTemplateSummary } from "../api/types.js";

/**
 * The section's landing page: what exists and whether it is healthy. The templates themselves live
 * in the Templates tree and its collection, where creating, importing and every other action is.
 */
@customElement("di-overview-dashboard")
export class DiOverviewDashboardElement extends UmbLitElement {
  /** Assigned by the extension host once the dashboard is instantiated. */
  manifest?: ManifestDashboard;

  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  @state()
  private _templates: DiTemplateSummary[] = [];

  @state()
  private _fonts: DiFont[] = [];

  @state()
  private _health?: DiHealthReport;

  @state()
  private _loading = true;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notificationContext = context;
    });

    this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
      this.#authContext = context;
      if (context) void this.#load();
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    // A template saved in the workspace changes the counts and, often, the issues.
    window.addEventListener(TEMPLATES_CHANGED_EVENT, this.#onTemplatesChanged);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(TEMPLATES_CHANGED_EVENT, this.#onTemplatesChanged);
  }

  #onTemplatesChanged = () => {
    if (this.#authContext) void this.#load();
  };

  #getToken: TokenGetter = () => this.#authContext?.getLatestToken();

  async #load() {
    this._loading = true;

    try {
      const [templates, fonts, health] = await Promise.all([
        fetchTemplates(this.#getToken),
        fetchFonts(this.#getToken).catch(() => [] as DiFont[]),
        fetchHealth(this.#getToken).catch(() => undefined),
      ]);

      this._templates = templates;
      this._fonts = fonts;
      this._health = health;
    } catch (error) {
      this.#notify("danger", "The dashboard could not be loaded", error);
    } finally {
      this._loading = false;
    }
  }

  #notify(colour: "positive" | "warning" | "danger", headline: string, error?: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (error) console.error("[DynamicImages]", headline, error);

    this.#notificationContext?.peek(colour, { data: { headline, message } });
  }

  render() {
    if (this._loading) return html`<div class="state"><uui-loader></uui-loader></div>`;

    return html`
      <umb-body-layout headline="Dynamic Images">
        ${this.#renderStats()} ${this.#renderHealth()}
      </umb-body-layout>
    `;
  }

  #renderStats() {
    const issues = this._health?.issues.filter((issue) => issue.severity !== "info").length ?? 0;

    return html`
      <div class="stats">
        ${this.#renderStat("Templates", this._templates.length, "icon-brush", false, hrefForWorkspace(DI_TEMPLATE_ROOT_ENTITY_TYPE))}
        ${this.#renderStat("Fonts", this._fonts.length, "icon-font", false, hrefForWorkspace(DI_FONT_ROOT_ENTITY_TYPE))}
        ${this.#renderStat("Issues", issues, issues > 0 ? "icon-alert" : "icon-check", issues > 0)}
        ${this.#renderStat(
          "Generation",
          this._health?.isEnabled === false ? "Off" : "On",
          "icon-power",
          this._health?.isEnabled === false,
        )}
      </div>
    `;
  }

  #renderStat(label: string, value: string | number, icon: string, warn = false, href?: string) {
    const body = html`
      <uui-icon name=${icon}></uui-icon>
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    `;

    return html`
      <uui-box class="stat ${warn ? "warn" : ""}">
        ${href ? html`<a class="stat-link" href=${href} aria-label="${label}: ${value}">${body}</a>` : body}
      </uui-box>
    `;
  }

  #renderHealth() {
    const issues = this._health?.issues.filter((issue) => issue.severity !== "info") ?? [];
    if (issues.length === 0) return nothing;

    return html`
      <uui-box headline="Needs attention">
        <uui-table>
          ${repeat(
            issues.slice(0, 8),
            (issue, index) => `${issue.code}-${index}`,
            (issue) => html`
              <uui-table-row>
                <uui-table-cell style="width: 90px">
                  <uui-tag color=${issue.severity === "error" ? "danger" : "warning"} look="secondary">
                    ${issue.severity}
                  </uui-tag>
                </uui-table-cell>
                <uui-table-cell>
                  ${issue.templateName ? html`<strong>${issue.templateName}</strong> — ` : nothing}${issue.message}
                </uui-table-cell>
              </uui-table-row>
            `,
          )}
        </uui-table>
        <uui-button look="secondary" href=${hrefForDashboard("health")} label="See all issues">See all</uui-button>
      </uui-box>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    uui-box {
      margin-bottom: var(--uui-size-layout-1);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--uui-size-space-4);
      margin-bottom: var(--uui-size-layout-1);
    }

    .stat {
      text-align: center;
    }

    .stat.warn {
      border-left: 3px solid var(--uui-color-warning);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.1;
    }

    .stat-label {
      color: var(--uui-color-text-alt);
      font-size: 0.85rem;
    }

    .stat-link {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    .stat-link:hover .stat-label {
      text-decoration: underline;
    }
  `;
}

export default DiOverviewDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-overview-dashboard": DiOverviewDashboardElement;
  }
}
