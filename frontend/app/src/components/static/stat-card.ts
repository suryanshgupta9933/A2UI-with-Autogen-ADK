import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface StatCardData {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: {
        value: number;
        direction: "up" | "down" | "neutral";
    };
    icon?: string;
}

@customElement("static-stat-card")
export class StaticStatCard extends LitElement {
    @property({ type: Object }) data: StatCardData = { title: "", value: "" };

    static styles = css`
    :host {
      display: block;
    }

    .stat-card {
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 20px 24px;
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .stat-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stat-change.up {
      color: #10b981;
    }

    .stat-change.down {
      color: #ef4444;
    }

    .stat-change.neutral {
      color: #64748b;
    }

    .stat-subtitle {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .arrow {
      font-size: 0.75rem;
    }
  `;

    render() {
        const { title, value, subtitle, change, icon } = this.data;

        return html`
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">${title}</span>
          ${icon ? html`<span class="stat-icon">${icon}</span>` : null}
        </div>
        <div class="stat-value">${value}</div>
        ${change || subtitle
                ? html`
              <div class="stat-footer">
                ${change
                        ? html`
                      <span class="stat-change ${change.direction}">
                        <span class="arrow">
                          ${change.direction === "up"
                                ? "↑"
                                : change.direction === "down"
                                    ? "↓"
                                    : "→"}
                        </span>
                        ${Math.abs(change.value)}%
                      </span>
                    `
                        : null}
                ${subtitle ? html`<span class="stat-subtitle">${subtitle}</span>` : null}
              </div>
            `
                : null}
      </div>
    `;
    }
}
