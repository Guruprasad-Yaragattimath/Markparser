"use strict";
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
// ---------- STREAM DRIVER (DO NOT EDIT) ----------
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
// ---------- PARSER STATE ----------
let mode = 'text';
let backtickBuffer = '';
let currentSpan = null;
// ---------- DOM HELPERS ----------
function createSpan() {
    const span = document.createElement('span');
    currentContainer.appendChild(span);
    return span;
}
// ---------- STREAMING MARKDOWN PARSER ----------
function addToken(token) {
    if (!currentContainer)
        return;
    let i = 0;
    while (i < token.length) {
        const ch = token[i];
        // ----- BACKTICKS -----
        if (ch === '`') {
            backtickBuffer += '`';
            i++;
            while (i < token.length && token[i] === '`') {
                backtickBuffer += '`';
                i++;
            }
            // ----- CODE BLOCK (```) -----
            if (backtickBuffer.length >= 3) {
                backtickBuffer = '';
                if (mode === 'block') {
                    mode = 'text';
                    currentSpan = null;
                }
                else {
                    mode = 'block';
                    currentSpan = createSpan();
                    currentSpan.style.display = 'block';
                    currentSpan.style.background = '#111';
                    currentSpan.style.color = '#0f0';
                    currentSpan.style.padding = '8px';
                    currentSpan.style.margin = '8px 0';
                    currentSpan.style.whiteSpace = 'pre-wrap';
                    currentSpan.style.fontFamily = 'monospace';
                }
                continue;
            }
            // ----- INLINE CODE (`) -----
            if (backtickBuffer.length === 1) {
                backtickBuffer = '';
                if (mode === 'inline') {
                    mode = 'text';
                    currentSpan = null;
                }
                else if (mode === 'text') {
                    mode = 'inline';
                    currentSpan = createSpan();
                    currentSpan.style.background = '#eee';
                    currentSpan.style.fontFamily = 'monospace';
                    currentSpan.style.padding = '2px 4px';
                    currentSpan.style.borderRadius = '4px';
                }
                continue;
            }
        }
        // ----- NORMAL TEXT -----
        if (!currentSpan) {
            currentSpan = createSpan();
        }
        currentSpan.innerText += ch;
        i++;
    }
}
//# sourceMappingURL=MarkdownParser.js.map