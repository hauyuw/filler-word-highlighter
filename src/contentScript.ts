import { StateField, StateEffect } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet } from '@codemirror/view';

const fillerWordHighlight = Decoration.mark({ class: 'cm-fillerWord' });

const fillerWords = [
    'that', 'then', 'start', 'begin', 'started', 'began', 'begun',
    'suddenly', 'down', 'up', 'kind of', 'really', 'just', 'basically',
    'would', 'could', 'feel', 'felt', 'think', 'thought'
];

const toggleHighlight = StateEffect.define<boolean>();

const highlightField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(value, tr) {
        value = value.map(tr.changes);
        for (const e of tr.effects) {
            if (e.is(toggleHighlight)) {
                if (e.value) {
                    const matches: {from: number, to: number}[] = [];
                    const text = tr.state.doc.toString();
                    for (const word of fillerWords) {
                        const regex = new RegExp(`\\b${word}\\b`, 'gi');
                        let match;
                        while ((match = regex.exec(text)) !== null) {
                            matches.push({
                                from: match.index,
                                to: match.index + match[0].length
                            });
                        }
                    }
                    // Sort matches by position
                    matches.sort((a, b) => a.from - b.from);
                    const decorations = matches.map(({from, to}) => 
                        fillerWordHighlight.range(from, to)
                    );
                    return Decoration.set(decorations, true);
                } else {
                    return Decoration.none;
                }
            }
        }
        return value;
    },
    provide: f => EditorView.decorations.from(f)
});

export default (context: any) => {
    return {
        plugin: (codeMirrorWrapper: any) => {
            // Exit if not a CodeMirror 6 editor
            if (!codeMirrorWrapper.cm6) return;

            const view = codeMirrorWrapper.cm6;
            
            // Register our command
            codeMirrorWrapper.defineExtension('toggleHighlight', (enabled: boolean) => {
                view.dispatch({
                    effects: toggleHighlight.of(enabled)
                });
            });

            // Initialize the state field
            view.dispatch({
                effects: StateEffect.appendConfig.of([highlightField])
            });
        },
        assets: () => {
            return [{ name: './fillerWordHighlighter.css' }];
        }
    };
};
