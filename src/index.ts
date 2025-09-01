import joplin from 'api';
import { ContentScriptType, ToolbarButtonLocation } from 'api/types';

let isEnabled = false;

joplin.plugins.register({
    onStart: async function() {
        // Register settings
        await joplin.settings.registerSettings({
            'highlightEnabled': {
                value: false,
                type: 2, // boolean
                section: 'fillerWordHighlighter',
                public: false,
                label: 'Highlight state',
            }
        });
        
        // Register the command to toggle highlighting
        await joplin.commands.register({
            name: 'toggleFillerWordHighlighting',
            label: 'Toggle Filler Word Highlighting',
            iconName: 'fas fa-highlighter',
            execute: async () => {
                isEnabled = !isEnabled;

                // Store the state in plugin settings
                await joplin.settings.setValue('highlightEnabled', isEnabled);
                
                // For markdown editor (CodeMirror)
                await joplin.commands.execute('editor.focus');
                await joplin.commands.execute('editor.execCommand', {
                    name: 'toggleHighlight',
                    args: [isEnabled]
                });

                // Force editor refresh to trigger re-render
                const note = await joplin.workspace.selectedNote();
                if (note) {
                    await joplin.commands.execute('editor.setText', note.body);
                }
            }
        });

        // Add toolbar button
        await joplin.views.toolbarButtons.create(
            'toggleFillerWordHighlightingButton',
            'toggleFillerWordHighlighting',
            ToolbarButtonLocation.EditorToolbar
        );

        // Register the CodeMirror plugin and CSS for markdown editor
        await joplin.contentScripts.register(
            ContentScriptType.CodeMirrorPlugin,
            'fillerWordHighlighter',
            './contentScript.js'
        );

        // Register CSS separately for CodeMirror 6
        await joplin.contentScripts.register(
            ContentScriptType.CodeMirrorPlugin,
            'fillerWordHighlighterCSS',
            './fillerWordHighlighter.css'
        );

        // Register TinyMCE plugin for rich text editor
        // await joplin.contentScripts.register(
        //     ContentScriptType.MarkdownItPlugin,
        //     'fillerWordHighlighterRichText',
        //     './richTextScript.js'
        // );
    }
});
