export default defineContentScript({
    "matches": ["https://chatgpt.com/*"],
    async main() {
        // document全体に対してイベントリスナーを登録することでロード時にテキストエリアが存在しない問題に対応している
        document.addEventListener("keydown", handleEnterKeyPress, { capture: true });
  },
});

function handleEnterKeyPress(event: KeyboardEvent) {
    // 変換確定前なら無視(preventDefaultで変換確定も無視される。結果的に変換確定されているが変な挙動を起こさせないためにも明示的にアーリーリターンしている)
    if (event.isComposing) return;
    // テキストエリアにフォーカスしてないなら無視
    const target = event.target as HTMLDivElement;
    if (!target || target.id !== "prompt-textarea") return;

    const isEnterOnly = (event.code == "Enter") && !event.ctrlKey && !event.metaKey && !event.shiftKey; // Shift, Ctrl,Win、Cmdキーと同時押しはfalse
    // Enterだけを押したとき、Shift+Enterを入力するイベントを発生させ、ユーザーがShift＋Enterを入力したと認識させる
    if (isEnterOnly) {
        event.preventDefault();

        // contenteditableでは sectionStart、sectionEndが使えないため長い実装になるのでShift+Enterのまま実装
        let shiftEnter = new KeyboardEvent('keydown', {
            key: "Enter",
            code: "Enter",
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });
        target.dispatchEvent(shiftEnter);
    }
}
