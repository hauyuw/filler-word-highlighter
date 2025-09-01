import joplin from 'api';
import { ContentScriptType, ToolbarButtonLocation } from 'api/types';

let isEnabled = false;

joplin.plugins.register({
    onStart: async function() {
        // Register the command to toggle highlighting
        await joplin.commands.register({
            name: 'toggleFillerWordHighlighting',
            label: 'Toggle Filler Word Highlighting',
            iconName: 'fas fa-highlighter',
            execute: async () => {
                isEnabled = !isEnabled;
                // Update all editors with the new state
                await joplin.commands.execute('editor.focus');
                await joplin.commands.execute('editor.execCommand', {
                    name: 'toggleHighlight',
                    args: [isEnabled]
                });
            }
        });

        // Add toolbar button
        await joplin.views.toolbarButtons.create(
            'toggleFillerWordHighlightingButton',
            'toggleFillerWordHighlighting',
            ToolbarButtonLocation.EditorToolbar
        );

        // Register the CodeMirror plugin and CSS
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
    }
});
