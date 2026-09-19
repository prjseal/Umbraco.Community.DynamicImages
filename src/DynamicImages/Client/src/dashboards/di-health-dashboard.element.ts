import { css, customElement, html, nothing, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { ManifestDashboard } from "@umbraco-cms/backoffice/dashboard";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
  fetchHealth, fetchSyncStatus, hrefForTemplate, runSyncExport, runSyncImport, type TokenGetter,
} from "../api/dynamic-images-api.js";
import type { DiHealthReport, DiSyncStatus } from "../api/types.js";

/** Everything wrong across every template at once, plus the environment-transfer controls. */
@customElement("di-health-dashboard")
export class DiHealthDashboardElement extends UmbLitElement {
  /** Assigned by the extension host once the dashboard is instantiated. */
  manifest?: ManifestDashboard;

  #authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  @state()
  private _health?: DiHealthReport;

  @state()
  private _sync?: DiSyncStatus;

  @state()
  private _loading = true;

  @state()
  private _busy = false;

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

  #getToken: TokenGetter = () => this.#authContext?.getLatestToken();

  async #load() {
    this._loading = true;

    try {
      const [health, sync] = await Promise.all([
        fetchHealth(this.#getToken),
        fetchSyncStatus(this.#getToken).catch(() => undefined),
      ]);

      this._health = health;
      this._sync = sync;
    } catch (error) {
      console.error("[DynamicImages] Failed to load health", error);
    } finally {
      this._loading = false;
    }
  }

  async #run(action: "export" | "import") {
    this._busy = true;

    try {
      const result = action === "export" ? await runSyncExport(this.#getToken) : await runSyncImport(this.#getToken);

      this.#notificationContext?.peek("positive", {
        data: {
          headline: action === "export" ? "Exported" : "Imported",
          message:
            action === "export"
              ? `${result.written} file(s) written.`
              : `${result.imported} template(s) imported.`,
        },
      });

      for (const message of result.messages.slice(0, 3)) {
        this.#notificationContext?.peek("warning", { data: { message } });
      }

      await this.#load();
    } catch (error) {
      this.#notificationContext?.peek("danger", {
        data: { headline: "That did not work", message: error instanceof Error ? error.message : "" },
      });
    } finally {
      this._busy = false;
    }
  }

  render() {
    if (this._loading) return html`<div class="state"><uui-loader></uui-loader></div>`;
    if (!this._health) return html`<p class="empty">The health report could not be loaded.</p>`;

    const issues = this._health.issues;
    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");

    return html`
      <umb-body-layout headline="Health">
        <uui-box headline="Summary">
          <div slot="header-actions">
            <uui-button look="secondary" label="Re-check" @click=${() => this.#load()}>Re-check</uui-button>
          </div>

          <ul class="summary">
            <li>
              Image generation is
              <strong class=${this._health.isEnabled ? "ok" : "bad"}>${this._health.isEnabled ? "on" : "off"}</strong>
              ${this._health.isEnabled ? nothing : html`(set <code>DynamicImages:Enabled</code> to true)`}
            </li>
            <li><strong>${this._health.templateCount}</strong> template(s), <strong>${this._health.fontCount}</strong> font(s)</li>
            <li>
              <strong class=${errors.length > 0 ? "bad" : "ok"}>${errors.length}</strong> error(s),
              <strong>${warnings.length}</strong> warning(s)
            </li>
          </ul>
        </uui-box>

        <uui-box headline="Issues">
          ${issues.length === 0
            ? html`<p class="empty"><uui-icon name="icon-check"></uui-icon> Everything checks out.</p>`
            : html`<uui-table>
                <uui-table-head>
                  <uui-table-head-cell>Severity</uui-table-head-cell>
                  <uui-table-head-cell>Template</uui-table-head-cell>
                  <uui-table-head-cell>Issue</uui-table-head-cell>
                  <uui-table-head-cell>Code</uui-table-head-cell>
                </uui-table-head>
                ${repeat(
                  issues,
                  (issue, index) => `${issue.code}-${index}`,
                  (issue) => html`
                    <uui-table-row>
                      <uui-table-cell>
                        <uui-tag
                          look="secondary"
                          color=${issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "default"}>
                          ${issue.severity}
                        </uui-tag>
                      </uui-table-cell>
                      <uui-table-cell>
                        ${issue.templateKey
                          ? html`<a href=${hrefForTemplate(issue.templateKey)}>${issue.templateName}</a>`
                          : html`<em>Site-wide</em>`}
                      </uui-table-cell>
                      <uui-table-cell>${issue.message}</uui-table-cell>
                      <uui-table-cell><code>${issue.code}</code></uui-table-cell>
                    </uui-table-row>
                  `,
                )}
              </uui-table>`}
        </uui-box>

        ${this.#renderSync()}
      </umb-body-layout>
    `;
  }

  #renderSync() {
    if (!this._sync) return nothing;

    return html`
      <uui-box headline="Environment transfer">
        <p>
          Templates live in the database. To move them between environments, export them to JSON files under
          <code>${this._sync.folder}</code> and commit those, or import files someone else committed.
        </p>
        <p class="meta">
          Mode: <strong>${this._sync.mode}</strong> · ${this._sync.fileCount} file(s)
          ${this._sync.lastWriteUtc ? html`· last written ${new Date(this._sync.lastWriteUtc).toLocaleString()}` : nothing}
        </p>

        <div class="row">
          <uui-button look="secondary" label="Export every template to disk" ?disabled=${this._busy} @click=${() => this.#run("export")}>
            Export to disk
          </uui-button>
          <uui-button look="secondary" label="Import templates from disk" ?disabled=${this._busy} @click=${() => this.#run("import")}>
            Import from disk
          </uui-button>
        </div>
      </uui-box>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    uui-box {
      margin-bottom: var(--uui-size-layout-1);
    }

    .state {
      display: flex;
      justify-content: center;
      padding: var(--uui-size-layout-3);
    }

    .summary {
      margin: 0;
      padding-left: var(--uui-size-space-5);
    }

    .ok {
      color: var(--uui-color-positive);
    }

    .bad {
      color: var(--uui-color-danger);
    }

    .empty {
      color: var(--uui-color-text-alt);
    }

    .meta {
      font-size: 12px;
      color: var(--uui-color-text-alt);
    }

    .row {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-wrap: wrap;
    }

    code {
      background: var(--uui-color-surface-alt);
      padding: 0 4px;
      border-radius: 2px;
    }
  `;
}

export default DiHealthDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "di-health-dashboard": DiHealthDashboardElement;
  }
}
