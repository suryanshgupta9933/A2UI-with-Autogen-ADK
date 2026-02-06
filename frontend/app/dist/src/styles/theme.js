export const darkTheme = {
    additionalStyles: {},
    components: {
        AudioPlayer: {},
        Button: {
            "border-br-12": true, // Rounded buttons
        },
        Card: {},
        CheckBox: {
            element: {},
            label: {},
            container: {}
        },
        Column: {},
        DateTimeInput: {
            container: {},
            label: {},
            element: {}
        },
        Divider: {},
        Image: {
            all: {},
            avatar: {},
            header: {},
            icon: {},
            largeFeature: {},
            mediumFeature: {},
            smallFeature: {}
        },
        Icon: {},
        List: {},
        Modal: {
            backdrop: {},
            element: {}
        },
        MultipleChoice: {
            container: {},
            label: {},
            element: {}
        },
        Row: {},
        Slider: {
            container: {},
            label: {},
            element: {}
        },
        Tabs: {
            container: {},
            controls: { all: {}, selected: {} },
            element: {}
        },
        Text: {
            all: {},
            h1: {},
            h2: {},
            h3: {},
            h4: {},
            h5: {},
            body: {},
            caption: {}
        },
        TextField: {
            container: {},
            label: {},
            element: {}
        },
        Video: {}
    },
    elements: {
        a: {}, audio: {}, body: {}, button: {},
        h1: {}, h2: {}, h3: {}, h4: {}, h5: {},
        iframe: {}, input: {}, p: {}, pre: {}, textarea: {}, video: {}
    },
    markdown: {
        p: [], h1: [], h2: [], h3: [], h4: [], h5: [],
        ul: [], ol: [], li: [], a: [], strong: [], em: []
    }
};
export const chatStyles = `
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #1e1e1e;
    color: #e0e0e0;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  header {
    padding: 1rem;
    background-color: #252526;
    border-bottom: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  header h1 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-area {
    padding: 1rem;
    background-color: #252526;
    border-top: 1px solid #333;
  }
`;
//# sourceMappingURL=theme.js.map