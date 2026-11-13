# BESTEP 備考講義站

培力英檢（BESTEP）聽力＋閱讀的備考講義網站。一個單元一頁，每天 15 分鐘，目標聽力、閱讀各達 **B1+（85 分）**。

- 網站：https://weihanlee.github.io/bestep-notes/
- 規則文件：[AGENTS.md](./AGENTS.md)（`CLAUDE.md` 會指向它）

## 這個專案的重點

這不是一次性的網頁，而是一套「讓 AI 照規則持續產出講義」的專案：

1. `AGENTS.md` 定義專案目的、風格、頁面固定結構、元件、命名規則、新增 SOP 與驗收清單。
2. `templates/lesson-template.html` 是每個單元的範本。
3. `data/lessons.json` 是唯一的目錄，首頁卡片與上一篇／下一篇都由它自動產生。
4. `raw/` 放原始素材與官方事實，AI 整理內容時從這裡取材。

## 新增一個單元

開一個新的 AI 對話，輸入：

```
請先讀 AGENTS.md，然後新增一個單元：閱讀第三部分 長文閱讀。
```

AI 會依照 SOP：複製範本 → 填入固定區塊 → 更新 lessons.json → 跑驗收清單。

## 本機預覽

```
python -m http.server 8000
```

打開 http://localhost:8000
