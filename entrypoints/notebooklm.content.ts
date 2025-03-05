// テキストボックスが遅延ロードにより遅れて表示されるからWXTの機能を使ってDOMが表示されるのを待つ。
// DOMを追加したいわけではないか機能をJSコードを実行しているだけなのでサンプルコードとは少し違う
// https://wxt.dev/guide/essentials/content-scripts.html#mounting-ui-to-dynamic-element

export default defineContentScript({
    "matches": ["https://notebooklm.google.com/notebook/*"],

    main(ctx) {
        const ui = createIntegratedUi(ctx, {
            position: 'modal',
            anchor: 'textarea.query-box-input',
            onMount: () => {
                document.addEventListener("keydown",  handleEnterKeyPress, { capture: true });
            }
        });
        ui.autoMount();
    },
});

function handleEnterKeyPress(event: KeyboardEvent) {
    // 変換確定前なら無視(preventDefaultで変換確定が勝手に行われるが変な挙動を起こさせないためにも明示的にアーリーリターンしている)
    if (event.isComposing) return;
    // テキストエリアにフォーカスしてないなら無視
    const target = event.target as HTMLTextAreaElement | null;
    if (!target || target.tagName !== "TEXTAREA") return;

    // Ctrl+Enter、Win+Enter、Cmd+Enter は送信。notebooklmにはこのショートカットがなかった
    const isCtrlEnter = (event.code == "Enter") && event.ctrlKey;
    const isMetaEnter = (event.code == "Enter") && event.metaKey;
    if (isCtrlEnter || isMetaEnter) {
        const submitBtn = document.querySelector("button.submit-button") as HTMLButtonElement;
        submitBtn.click();
    }

    // Enterだけ押したら改行
    const isEnterOnly = (event.code == "Enter") && !event.ctrlKey && !event.metaKey && !event.shiftKey; // Shift, Ctrl,Win、Cmdキーと同時押しはfalse
    if (isEnterOnly) {
        event.stopPropagation();
    }
}
