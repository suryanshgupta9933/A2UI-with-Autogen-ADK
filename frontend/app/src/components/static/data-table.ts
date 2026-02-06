import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface TableColumn {
    key: string;
    label: string;
    width?: string;
}

export interface TableData {
    columns: TableColumn[] | string[];
    rows: any[][];
    title?: string;
}

@customElement("static-data-table")
export class StaticDataTable extends LitElement {
    @property({ type: Object }) data: TableData = { columns: [], rows: [] };

    static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .table-container {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .table-title {
      padding: 16px 20px;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9375rem;
    }

    thead {
      background: #f1f5f9;
    }

    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #475569;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }

    td {
      padding: 14px 16px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover {
      background: #f8fafc;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      color: #94a3b8;
    }
  `;

    private getColumns(): { key: string; label: string }[] {
        if (!this.data.columns || this.data.columns.length === 0) return [];

        // Handle both string[] and TableColumn[] formats
        return this.data.columns.map((col, idx) => {
            if (typeof col === "string") {
                return { key: String(idx), label: col };
            }
            return col as { key: string; label: string };
        });
    }

    render() {
        const columns = this.getColumns();
        const rows = this.data.rows || [];

        if (columns.length === 0) {
            return html`
        <div class="table-container">
          <div class="empty-state">No data available</div>
        </div>
      `;
        }

        return html`
      <div class="table-container">
        ${this.data.title ? html`<div class="table-title">${this.data.title}</div>` : null}
        <table>
          <thead>
            <tr>
              ${columns.map((col) => html`<th>${col.label}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${rows.map(
            (row) => html`
                <tr>
                  ${row.map((cell) => html`<td>${cell}</td>`)}
                </tr>
              `
        )}
          </tbody>
        </table>
      </div>
    `;
    }
}
