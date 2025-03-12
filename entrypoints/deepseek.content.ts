
// DeepSeekはアクセスされない対策をたくさんしてるからページ構造が可能性も考えて共通化せずに個別に対応していく
// CSPしてる、classに特徴がない、divばかり使ってるなど

export default defineContentScript({
    "matches": ["https://chat.deepseek.com/*"],
    main() {
        // document全体に対してイベントリスナーを登録することでロード時にテキストエリアが存在しない問題に対応している
        document.addEventListener("keydown",  handleEnterKeyPress, { capture: true });
    },
});

function handleEnterKeyPress(event: KeyboardEvent) {
    // 変換確定前なら無視(preventDefaultで変換確定も無視される。結果的に変換確定されているが変な挙動を起こさせないためにも明示的にアーリーリターンしている)
    if (event.isComposing) return;
    // テキストエリアにフォーカスしてないなら無視
    const target = event.target as HTMLTextAreaElement | null;
    if (!target || target.id !== "chat-input") return;

    const isEnterOnly = (event.code == "Enter") && !event.ctrlKey && !event.metaKey && !event.shiftKey

    if (isEnterOnly) {
        // 祖先要素のどこかにEnter改行するイベントリスナーがあるのでイベント伝播を停止してEnter送信させない
        event.stopPropagation();
    }
}
