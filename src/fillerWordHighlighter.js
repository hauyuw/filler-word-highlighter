module.exports = {
    default: function(CodeMirror) {
        const wordHighlights = {
            'that': 'highlight-that',
            'then': 'highlight-then',
            'start': 'highlight-start',
            'begin': 'highlight-begin',
            'started': 'highlight-started',
            'began': 'highlight-began',
            'begun': 'highlight-begun',
            'suddenly': 'highlight-suddenly',
            'down': 'highlight-down',
            'up': 'highlight-up',
            'kind of': 'highlight-kindof',
            'really': 'highlight-really',
            'just': 'highlight-just',
            'basically': 'highlight-basically',
            'would': 'highlight-would',
            'could': 'highlight-could',
            'feel': 'highlight-feel',
            'felt': 'highlight-felt',
            'think': 'highlight-think',
            'thought': 'highlight-thought'
        };

        // Create a new overlay mode
        CodeMirror.defineMode("fillerWordHighlighter", function(config, parserConfig) {
            return {
                token: function(stream) {
                    for (let word in wordHighlights) {
                        if (stream.match(new RegExp('\\b' + word + '\\b', 'i'))) {
                            return wordHighlights[word];
                        }
                    }
                    stream.next();
                    return null;
                }
            };
        });

        // Add the overlay to CodeMirror
        CodeMirror.defineOption("fillerWordHighlighter", false, function(cm, val, old) {
            if (val && val != old) {
                cm.addOverlay({ mode: "fillerWordHighlighter" });
                cm.refresh();
            } else if (!val && val != old) {
                cm.removeOverlay({ mode: "fillerWordHighlighter" });
                cm.refresh();
            }
        });
    }
};
