/**
 * Static Component Registry
 * Maps component names from backend to pre-built Lit components
 */

// Import static components
import "./components/static/data-table.js";
import "./components/static/time-series-chart.js";
import "./components/static/stat-card.js";

// Import A2UI standard components
import * as UI from "@a2ui/lit/ui";

/**
 * Registry of static UI components.
 * Keys are component identifiers returned by backend tools.
 */
export const staticComponentRegistry: Record<string, string> = {
    data_table: "static-data-table",
    time_series: "static-time-series",
    stat_card: "static-stat-card",
};

/**
 * Check if a component identifier is a static component
 */
export function isStaticComponent(componentId: string): boolean {
    return componentId in staticComponentRegistry;
}

/**
 * Get the HTML tag name for a static component
 */
export function getStaticComponentTag(componentId: string): string | undefined {
    return staticComponentRegistry[componentId];
}

// Export UI for A2UI components
export { UI };
