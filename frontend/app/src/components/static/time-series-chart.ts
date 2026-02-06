import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export interface TimeSeriesPoint {
    timestamp: string | number;
    value: number;
    label?: string;
}

export interface TimeSeriesData {
    title?: string;
    points: TimeSeriesPoint[];
    yAxisLabel?: string;
    xAxisLabel?: string;
    color?: string;
}

@customElement("static-time-series")
export class StaticTimeSeries extends LitElement {
    @property({ type: Object }) data: TimeSeriesData = { points: [] };

    static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .chart-container {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 20px;
    }

    .chart-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
    }

    .chart-area {
      position: relative;
      height: 240px;
      display: flex;
      align-items: flex-end;
      gap: 2px;
      padding: 20px 0 30px 40px;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 24.9%,
        #f1f5f9 25%,
        transparent 25.1%,
        transparent 49.9%,
        #f1f5f9 50%,
        transparent 50.1%,
        transparent 74.9%,
        #f1f5f9 75%,
        transparent 75.1%
      );
    }

    .bar {
      flex: 1;
      background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 4px 4px 0 0;
      transition: opacity 0.15s;
      position: relative;
      min-width: 8px;
      max-width: 40px;
    }

    .bar:hover {
      opacity: 0.8;
    }

    .bar:hover::after {
      content: attr(data-value);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      white-space: nowrap;
      margin-bottom: 4px;
    }

    .x-axis {
      display: flex;
      justify-content: space-between;
      padding: 8px 0 0 40px;
      font-size: 0.75rem;
      color: #64748b;
    }

    .y-axis {
      position: absolute;
      left: 0;
      top: 20px;
      bottom: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
      text-align: right;
      width: 35px;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      color: #94a3b8;
    }

    .axis-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-align: center;
      margin-top: 12px;
    }
  `;

    render() {
        const points = this.data.points || [];

        if (points.length === 0) {
            return html`
        <div class="chart-container">
          <div class="empty-state">No data available</div>
        </div>
      `;
        }

        const maxValue = Math.max(...points.map((p) => p.value));
        const minValue = Math.min(...points.map((p) => p.value));
        const range = maxValue - minValue || 1;

        return html`
      <div class="chart-container">
        ${this.data.title ? html`<div class="chart-title">${this.data.title}</div>` : null}
        <div class="chart-area">
          <div class="y-axis">
            <span>${maxValue.toLocaleString()}</span>
            <span>${((maxValue + minValue) / 2).toLocaleString()}</span>
            <span>${minValue.toLocaleString()}</span>
          </div>
          ${points.map((point) => {
            const height = ((point.value - minValue) / range) * 100;
            return html`
              <div
                class="bar"
                style="height: ${Math.max(height, 2)}%"
                data-value="${point.value.toLocaleString()}"
              ></div>
            `;
        })}
        </div>
        <div class="x-axis">
          <span>${this.formatTimestamp(points[0]?.timestamp)}</span>
          <span>${this.formatTimestamp(points[Math.floor(points.length / 2)]?.timestamp)}</span>
          <span>${this.formatTimestamp(points[points.length - 1]?.timestamp)}</span>
        </div>
        ${this.data.xAxisLabel ? html`<div class="axis-label">${this.data.xAxisLabel}</div>` : null}
      </div>
    `;
    }

    private formatTimestamp(ts: string | number | undefined): string {
        if (!ts) return "";
        if (typeof ts === "number") {
            return new Date(ts).toLocaleDateString();
        }
        return ts;
    }
}
