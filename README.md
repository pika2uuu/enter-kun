

## 対応サイト
* https://chatgpt.com/
* https://chat.deepseek.com/
* https://www.perplexity.ai/
* https://x.com/i/grok
* https://claude.ai/

## 対策検討中
* https://notebooklm.google.com/

延ロードが原因か？初回ロード時ではEnter送信ができないが再度読み込みするとEnter送信できるようになる。



# 新しいサイトの試し方

1. `~/wxt.config.ts`の`start_urls`に対象のサイトを追加
開発しやすいようにブラウザ起動時に開くサイトに対象のサイトを設定します
2. ブラウザで会員登録/ログインをします
サイトの挙動を確かめるために開発用のChromeでログインしなければなりません。開発用のChromeのログイン情報は`~/.wxt/chrome-data`に格納されており、Githubで共有されることはありません
3. DevToolsで以下のコードを実行し、対象サイトの入力欄をクリックします

```js
document.addEventListener("focusin", (event) => {
    console.log(event.target);
});
```
4.　作業3で入力欄が<textarea>であれば`~/entrypoints/other-platforms.ts`の`matches`に対象サイトのURLを入れてみる。

