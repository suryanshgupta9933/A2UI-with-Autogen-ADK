/*
 * A2UI Theme Configuration
 * Based on A2UI/samples/client/lit/shell/theme/default-theme.ts
 */

import { v0_8 } from "@a2ui/lit";

/** Elements */

const a = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-500": true,
  "layout-as-n": true,
  "layout-dis-iflx": true,
  "layout-al-c": true,
  "typography-td-none": true,
  "color-c-p40": true,
};

const audio = {
  "layout-w-100": true,
};

const body = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-mt-0": true,
  "layout-mb-2": true,
  "typography-sz-bm": true,
  "color-c-n10": true,
};

const button = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-500": true,
  "layout-pt-3": true,
  "layout-pb-3": true,
  "layout-pl-5": true,
  "layout-pr-5": true,
  "layout-mb-1": true,
  "border-br-16": true,
  "border-bw-0": true,
  "border-c-n70": true,
  "border-bs-s": true,
  "color-bgc-s30": true,
  "behavior-ho-80": true,
};

const heading = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-500": true,
  "layout-mt-0": true,
  "layout-mb-2": true,
};

const iframe = {
  "behavior-sw-n": true,
};

const input = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-pl-4": true,
  "layout-pr-4": true,
  "layout-pt-2": true,
  "layout-pb-2": true,
  "border-br-6": true,
  "border-bw-1": true,
  "color-bc-s70": true,
  "border-bs-s": true,
  "layout-as-n": true,
  "color-c-n10": true,
};

const p = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true,
};

const orderedList = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true,
};

const unorderedList = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true,
};

const listItem = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true,
};

const pre = {
  "typography-f-c": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "typography-sz-bm": true,
  "typography-ws-p": true,
  "layout-as-n": true,
};

const textarea = {
  ...input,
  "layout-r-none": true,
  "layout-fs-c": true,
};

const video = {
  "layout-el-cv": true,
};

const aLight = v0_8.Styles.merge(a, {});
const inputLight = v0_8.Styles.merge(input, {});
const textareaLight = v0_8.Styles.merge(textarea, {});
const buttonLight = v0_8.Styles.merge(button, {});
const bodyLight = v0_8.Styles.merge(body, {});
const pLight = v0_8.Styles.merge(p, {});
const preLight = v0_8.Styles.merge(pre, {});
const orderedListLight = v0_8.Styles.merge(orderedList, {});
const unorderedListLight = v0_8.Styles.merge(unorderedList, {});
const listItemLight = v0_8.Styles.merge(listItem, {});

export const darkTheme: v0_8.Types.Theme = {
  additionalStyles: {
    Button: {
      "--n-35": "var(--n-100)",
      "--n-10": "var(--n-0)",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#ffffff",
    },
    Text: {
      h1: {
        color: "#f8fafc",
        fontSize: "1.5rem",
        fontWeight: "600",
      },
      h2: {
        color: "#f1f5f9",
        fontSize: "1.25rem",
        fontWeight: "500",
      },
      h3: {
        color: "#e2e8f0",
        fontSize: "1.125rem",
        fontWeight: "500",
      },
      h4: { color: "#cbd5e1" },
      h5: { color: "#94a3b8" },
      body: { color: "#e2e8f0" },
      caption: { color: "#94a3b8" },
    },
    Card: {
      background: "rgba(30, 41, 59, 0.8)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(148, 163, 184, 0.1)",
      borderRadius: "12px",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
    },
    TextField: {
      "--p-0": "#1e293b",
    },
  },
  components: {
    AudioPlayer: {},
    Button: {
      "layout-pt-2": true,
      "layout-pb-2": true,
      "layout-pl-3": true,
      "layout-pr-3": true,
      "border-br-12": true,
      "border-bw-0": true,
      "border-bs-s": true,
      "color-bgc-p30": true,
      "behavior-ho-70": true,
      "typography-w-400": true,
    },
    Card: { "border-br-9": true, "layout-p-4": true, "color-bgc-n100": true },
    CheckBox: {
      element: {
        "layout-m-0": true,
        "layout-mr-2": true,
        "layout-p-2": true,
        "border-br-12": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bgc-p100": true,
        "color-bc-p60": true,
        "color-c-n30": true,
        "color-c-p30": true,
      },
      label: {
        "color-c-p30": true,
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-flx-1": true,
        "typography-sz-ll": true,
      },
      container: {
        "layout-dsp-iflex": true,
        "layout-al-c": true,
      },
    },
    Column: {
      "layout-g-2": true,
    },
    DateTimeInput: {
      container: {
        "typography-sz-bm": true,
        "layout-w-100": true,
        "layout-g-2": true,
        "layout-dsp-flexhor": true,
        "layout-al-c": true,
        "typography-ws-nw": true,
      },
      label: {
        "color-c-p30": true,
        "typography-sz-bm": true,
      },
      element: {
        "layout-pt-2": true,
        "layout-pb-2": true,
        "layout-pl-3": true,
        "layout-pr-3": true,
        "border-br-2": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bgc-p100": true,
        "color-bc-p60": true,
        "color-c-n30": true,
        "color-c-p30": true,
      },
    },
    Divider: {},
    Image: {
      all: {
        "border-br-5": true,
        "layout-el-cv": true,
        "layout-w-100": true,
        "layout-h-100": true,
      },
      avatar: { "is-avatar": true },
      header: {},
      icon: {},
      largeFeature: {},
      mediumFeature: {},
      smallFeature: {},
    },
    Icon: {},
    List: {
      "layout-g-4": true,
      "layout-p-2": true,
    },
    Modal: {
      backdrop: { "color-bbgc-p60_20": true },
      element: {
        "border-br-2": true,
        "color-bgc-p100": true,
        "layout-p-4": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bc-p80": true,
      },
    },
    MultipleChoice: {
      container: {},
      label: {},
      element: {},
    },
    Row: {
      "layout-g-4": true,
    },
    Slider: {
      container: {},
      label: {},
      element: {},
    },
    Tabs: {
      container: {},
      controls: { all: {}, selected: {} },
      element: {},
    },
    Text: {
      all: {
        "layout-w-100": true,
        "layout-g-2": true,
      },
      h1: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-hs": true,
      },
      h2: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-tl": true,
      },
      h3: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-tl": true,
      },
      h4: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-bl": true,
      },
      h5: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-bm": true,
      },
      body: {},
      caption: {},
    },
    TextField: {
      container: {
        "typography-sz-bm": true,
        "layout-w-100": true,
        "layout-g-2": true,
        "layout-dsp-flexhor": true,
        "layout-al-c": true,
        "typography-ws-nw": true,
      },
      label: {
        "layout-flx-0": true,
        "color-c-p30": true,
      },
      element: {
        "typography-sz-bm": true,
        "layout-pt-2": true,
        "layout-pb-2": true,
        "layout-pl-3": true,
        "layout-pr-3": true,
        "border-br-2": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bgc-p100": true,
        "color-bc-p60": true,
        "color-c-n30": true,
        "color-c-p30": true,
      },
    },
    Video: {
      "border-br-5": true,
      "layout-el-cv": true,
    },
  },
  elements: {
    a: aLight,
    audio,
    body: bodyLight,
    button: buttonLight,
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    iframe,
    input: inputLight,
    p: pLight,
    pre: preLight,
    textarea: textareaLight,
    video,
  },
  markdown: {
    p: [...Object.keys(pLight)],
    h1: [...Object.keys(heading)],
    h2: [...Object.keys(heading)],
    h3: [...Object.keys(heading)],
    h4: [...Object.keys(heading)],
    h5: [...Object.keys(heading)],
    ul: [...Object.keys(unorderedListLight)],
    ol: [...Object.keys(orderedListLight)],
    li: [...Object.keys(listItemLight)],
    a: [...Object.keys(aLight)],
    strong: [],
    em: [],
  },
};

// Light theme for Artifacts panel
export const lightTheme: v0_8.Types.Theme = {
  additionalStyles: {
    Button: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#ffffff",
    },
    Text: {
      h1: { color: "#1e293b", fontSize: "1.5rem", fontWeight: "600" },
      h2: { color: "#334155", fontSize: "1.25rem", fontWeight: "500" },
      h3: { color: "#475569", fontSize: "1.125rem", fontWeight: "500" },
      h4: { color: "#64748b" },
      h5: { color: "#94a3b8" },
      body: { color: "#334155" },
      caption: { color: "#64748b" },
    },
    Card: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    },
    TextField: {
      "--p-0": "#ffffff",
    },
  },
  components: darkTheme.components,
  elements: darkTheme.elements,
  markdown: darkTheme.markdown,
};

// Chat UI Styles - Modern minimal design inspired by reference
export const chatStyles = `
  * {
    box-sizing: border-box;
  }

  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    color: #e2e8f0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  header h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  header h1::before {
    content: '';
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
  }

  .chat-history {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
  }

  .chat-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-area {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 16px 24px 24px;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(148, 163, 184, 0.1);
  }

  .input-container {
    width: 100%;
    max-width: 800px;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #94a3b8;
    font-size: 0.875rem;
    padding: 16px;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.1);
  }

  .loading-indicator::before {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid rgba(99, 102, 241, 0.3);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Scrollbar styling */
  .chat-history::-webkit-scrollbar {
    width: 6px;
  }

  .chat-history::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-history::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.2);
    border-radius: 3px;
  }

  .chat-history::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.3);
  }
`;
