module.exports = {
    default: function(context) { 
        return {
            plugin: function(markdownIt) {
                // Store the original renderer
                const defaultRender = markdownIt.renderer.rules.text 
                    || function(tokens, idx, options, env) {
                        return tokens[idx].content;
                    };

                // Override the text renderer
                markdownIt.renderer.rules.text = function(tokens, idx, options, env) {
                    const token = tokens[idx];
                    const text = token.content;
                    
                    // If highlighting is disabled, use default rendering
                    if (!context.settings['highlightEnabled']) {
                        return defaultRender(tokens, idx, options, env);
                    }

                    const fillerWords = [
                        'that', 'then', 'start', 'begin', 'started', 'began', 'begun',
                        'suddenly', 'down', 'up', 'kind of', 'really', 'just', 'basically',
                        'would', 'could', 'feel', 'felt', 'think', 'thought'
                    ];

                    let highlightedText = text;
                    fillerWords.forEach(word => {
                        const regex = new RegExp(`\\b${word}\\b`, 'gi');
                        highlightedText = highlightedText.replace(regex, (match) => {
                            return `<span class="cm-fillerWord" data-word="${word.toLowerCase()}">${match}</span>`;
                        });
                    });

                    return highlightedText;
                };

                return markdownIt;
            },
            assets: function() {
                return [
                    { name: './fillerWordHighlighter.css' }
                ];
            }
        }
    }
}
