

// DOMを追加したいわけではないか機能をJSコードを実行しているだけなのでサンプルコードとは少し違う
// https://wxt.dev/guide/essentials/content-scripts.html#mounting-ui-to-dynamic-element

export default defineContentScript({
    "matches": ["https://claude.ai/*"],

    // 遅延ロードで入力欄を表示しているので入力欄が現れてから処理を実行する
    main(ctx) {
        const ui = createIntegratedUi(ctx, {
            position: 'modal',
            anchor: 'div[contenteditable]',
            onMount: () => {
                window.addEventListener("keydown",  handleEnterKeyPress, { capture: true });
            }
        });
        ui.autoMount();
    },
});

function handleEnterKeyPress(event: KeyboardEvent) {
    // 変換確定前なら無視(preventDefaultで変換確定が勝手に行われるが変な挙動を起こさせないためにも明示的にアーリーリターンしている)
    if (event.isComposing) return;
    // テキストエリアにフォーカスしてないなら無視
    const target = event.target as HTMLDivElement | null;
    if (!target) return;

    // Enterだけ押したら改行
    const isEnterOnly = (event.key == "Enter") && !event.ctrlKey && !event.metaKey && !event.shiftKey; // Shift, Ctrl,Win、Cmdキーと同時押しはfalse
    if (isEnterOnly) {
        event.preventDefault();
        event.stopPropagation();

        // contenteditableでは sectionStart、sectionEndが使えないため長い実装になるのでShift+Enterのまま実装
        const shiftEnter = new KeyboardEvent('keydown', {
            key: "Enter",
            code: "Enter",
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });
        target.dispatchEvent(shiftEnter);

        alert("enter only")
    }
}
