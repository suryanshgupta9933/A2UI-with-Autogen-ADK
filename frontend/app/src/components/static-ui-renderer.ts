import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { isStaticComponent, getStaticComponentTag } from "../ui-registry.js";

// Import static components to register them
import "./static/data-table.js";
import "./static/time-series-chart.js";
import "./static/stat-card.js";

export interface StaticUIPayload {
    component: string;
    data: any;
}

/**
 * Renders static UI components based on backend tool responses
 */
@customElement("static-ui-renderer")
export class StaticUIRenderer extends LitElement {
    @property({ type: Object }) payload: StaticUIPayload | null = null;

    static styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

    render() {
        if (!this.payload) {
            return html`<div>No static UI data</div>`;
        }

        const { component, data } = this.payload;

        if (!isStaticComponent(component)) {
            return html`<div>Unknown component: ${component}</div>`;
        }

        const tagName = getStaticComponentTag(component);

        // Dynamically render the component
        switch (component) {
            case "data_table":
                return html`<static-data-table .data=${data}></static-data-table>`;
            case "time_series":
                return html`<static-time-series .data=${data}></static-time-series>`;
            case "stat_card":
                return html`<static-stat-card .data=${data}></static-stat-card>`;
            default:
                return html`<div>Unsupported component: ${component}</div>`;
        }
    }
}
