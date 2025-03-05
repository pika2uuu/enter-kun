export default defineContentScript({
    "matches": [
        "https://www.perplexity.ai/*",
        "https://x.com/i/grok*",
        "https://chat.deepseek.com/",
    ],
    async main() {
        // document全体に対してイベントリスナーを登録することでロード時にテキストエリアが存在しない問題に対応している
        document.addEventListener("keydown",  handleEnterKeyPress, { capture: true });
        document.addEventListener("keydown", handleSubmitKeyPress, { capture: true });
    },
});

async function handleEnterKeyPress(event: KeyboardEvent) {
    // 変換確定前なら無視(preventDefaultで変換確定が勝手に行われるが変な挙動を起こさせないためにも明示的にアーリーリターンしている)
    if (event.isComposing) return;
    // テキストエリアにフォーカスしてないなら無視
    const target = event.target as HTMLTextAreaElement | null;
    if (!target || target.tagName !== "TEXTAREA") return;

    // Enterだけなら改行
    const isEnterOnly = (event.code == "Enter") && !event.ctrlKey && !event.metaKey && !event.shiftKey; // Shift, Ctrl,Win、Cmdキーと同時押しはfalse
    console.log(isEnterOnly)
    if (isEnterOnly) {
        console.log("enter only")
        event.preventDefault();
        event.stopPropagation()
        // preventDefaultでデフォルトの改行も停止させられるから手動で改行する必要がある
        addNewLineAndFocus(target);
        // inputイベントを発火させることでReactで作られた入力欄のstateも変更できて上書きされずにテキストを入力できる
        target.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

function addNewLineAndFocus(textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + "\n" + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    textarea.focus();
}

async function handleSubmitKeyPress(event: KeyboardEvent) {
    // 変換確定前なら無視(preventDefaultで変換確定が勝手に行われるが変な挙動を起こさせないためにも明示的にアーリーリターンしている)
    if (event.isComposing) return;
    // テキストエリアにフォーカスしてないなら無視
    const target = event.target as HTMLTextAreaElement | null;
    if (!target || target.tagName !== "TEXTAREA") return;

    // 送信処理
    const isCtrlEnter = (event.code == "Enter") && event.ctrlKey; // Ctrl+Enter でtrue
    const isMetaEnter = (event.code == "Enter") && event.metaKey; // (Mac)⌘+Enter でtrue
    if (isCtrlEnter || isMetaEnter) {
        const submitBtn = findSubmitButton(window.location.href);
        if (submitBtn) {
            submitBtn.click();
        }
    }
}

// window.location だとSPAに対応してないためXからGrokへ移動したときちゃんと認識されるか心配
function findSubmitButton(currentUrl: string): HTMLButtonElement | undefined {
    const url = new URL(currentUrl);
    if (url.hostname === "x.com" && url.pathname === "/i/grok") {
        return document.querySelector('button[aria-label="Grok something"]') as HTMLButtonElement;
    } else if (url.hostname === "notebooklm.google.com") {
        return document.querySelector("button.submit-button") as HTMLButtonElement;
    } else if (url.hostname === "chat.deepseek.com/") {

    } else {
        console.log("current url is not listed for fetching send button DOM");
    }
}