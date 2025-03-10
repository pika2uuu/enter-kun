import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    extensionApi: 'chrome',
    modules: ['@wxt-dev/module-react'],
    runner: {
        startUrls: ["https://chatgpt.com/", "https://chat.deepseek.com/https://chat.deepseek.com/", "https://www.perplexity.ai/", "https://x.com/i/grok", "https://notebooklm.google.com/", "https://claude.ai/"],
        chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
    },
    manifest: {
        name: "Enter Kun",
        version: "1.0.0",
        description: "Enter is a New Line, not a Sender.  ChatGPT, Grok, DeepSeek, NotebookLM",
        declarative_net_request: {
            rule_resources: [
                {
                    id: 'deepseek',
                    enabled: true,
                    path: 'rules/deepseek.json',
                }
            ]
        },
    }
});
