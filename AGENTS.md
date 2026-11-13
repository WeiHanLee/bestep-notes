# AGENTS.md — BESTEP 備考講義站 員工手冊

> 任何 AI（Claude、Codex、Gemini、Copilot…）在這個專案做事之前，**先完整讀完這份文件**。
> 這份文件是本專案唯一的規則來源；`CLAUDE.md` 只是指向這裡。
> 規則和使用者的當次指示衝突時，以使用者為準，並在完成後提醒他是否要更新本文件。

---

## 0. 交辦三件事（先看這段，30 秒掌握全部）

> 對應課堂講義「好老闆要說清楚三件事」：**要什麼成品、有什麼限制、怎麼算做完。不要讓 AI 猜。**

| 三件事 | 這個專案的答案 | 細節在 |
|---|---|---|
| **要什麼成品** | 一個單元 = 一個 `lessons/NN-skill-topic.html`＋`data/lessons.json` 多一筆；頁面含 8 個固定區塊、至少 3 題原創練習 | 第 3、4、7 節 |
| **有什麼限制** | **可以動**：`lessons/`、`data/lessons.json`、`raw/`。**不可動**（除非使用者明說）：`assets/css/style.css` 的變數、`assets/js/*`、`templates/`、其他單元內容。純 HTML/CSS/JS、不用外部網址、例題必須原創 | 第 2、9、11 節 |
| **怎麼算做完** | 第 12 節驗收清單全部打勾，並回報新增的檔案、標題、題數 | 第 10、12 節 |

**不要猜的規則**：
- 使用者指示模糊（例如沒說要哪個題型、哪個主題範圍）時，**先問一個最關鍵的問題或先列計畫再動手**；小事（例如題目措辭）直接依本文件決定，不必問。
- 需要事實資料（題數、時間、分數）但 `raw/` 沒有時，**不要憑記憶補**，先請使用者提供或查官方來源。
- 做完後只回報事實：改了什麼、哪一項驗收沒過；不確定的地方明說。

---

## 1. 專案目的

- **這是什麼**：一個「培力英檢 BESTEP 聽力＋閱讀」的備考講義網站，一個單元（lesson）一頁。
- **給誰看**：大專校院學生（作者本人：臺科大電機碩一，目標 **聽力、閱讀各達 B1+，即 85 分以上**）。
- **怎麼用**：每天花約 15 分鐘讀一個單元、做完頁面裡的互動練習。
- **長期目標**：之後只要說「新增一個關於 ○○ 的單元」，AI 讀完本文件就能產出風格、結構完全一致的新頁面，不需要再解釋。

## 2. 技術限制（不可違反）

| 規則 | 原因 |
|---|---|
| 純 HTML + CSS + 原生 JavaScript，**不用框架、不用建置工具、不用 npm** | 直接部署 GitHub Pages，零設定 |
| **不引用任何外部 CDN、字型或圖片網址**（`<script src>`、`<link href>`、`<img src>` 都不可指向外部）；**純文字超連結 `<a href>` 可以**，但只用在「資料來源」區塊與頁尾 | 離線可用、不會因外部網站掛掉而壞掉 |
| 所有路徑一律用**相對路徑** | GitHub Pages 網址帶有 repo 名稱子路徑 |
| 不新增 CSS 檔或 JS 檔；樣式只寫在 `assets/css/style.css`，行為只寫在 `assets/js/` 既有檔案 | 保持單一來源，避免風格分裂 |
| 頁面內**不寫 `<style>` 和行內 `style=""`**、**不寫 `<script>` 邏輯** | 同上 |
| 根目錄必須保留 `.nojekyll` | 讓 GitHub Pages 原樣輸出檔案 |

本機預覽：首頁會用 `fetch()` 讀 JSON，直接雙擊 HTML 會失敗，請在專案根目錄執行
`python -m http.server 8000`，再開 `http://localhost:8000`。**沒有可用的 Python 時**（例如 Windows 只有商店空殼），改用 `npx serve .` 或 VS Code 的 Live Server；也可以直接檢查已部署的 GitHub Pages 網址。

## 3. 目錄結構

```
bestep-notes/
├── AGENTS.md                 ← 本文件（規則）
├── CLAUDE.md                 ← 只寫「請先讀 AGENTS.md」
├── README.md                 ← 給人看的專案介紹
├── index.html                ← 首頁：自動讀 data/lessons.json 產生單元卡片
├── .nojekyll
├── data/
│   └── lessons.json          ← 網站設定＋所有單元的目錄（唯一的目錄來源）
├── lessons/                  ← 每個單元一個 HTML
│   ├── 00-overview.html
│   ├── 01-reading-vocab.html
│   └── ...
├── templates/
│   └── lesson-template.html  ← 新單元一律從這裡複製
├── raw/                      ← 原始素材：官方資訊摘要、個人筆記、錯題（AI 整理內容時從這裡取材）
└── assets/
    ├── css/style.css         ← 全站唯一樣式
    └── js/
        ├── main.js           ← 首頁：讀 JSON、篩選、倒數、完成狀態
        └── lesson.js         ← 單元頁：測驗互動、朗讀、上一篇/下一篇、完成打勾
```

## 4. 命名規則

- 單元檔名：`NN-skill-topic.html`
  - `NN`：兩位數編號，決定排序（`00` 留給總覽）。
  - `skill`：`overview`｜`reading`｜`listening`｜`vocab`｜`review`（只能用這五個）。
  - `topic`：英文小寫、以 `-` 連接、最多 3 個字，例如 `short`、`long-passage`。
  - 例：`04-reading-long.html`、`05-listening-short-talk.html`。
- 單元 `id` = 檔名去掉 `.html`，例如 `04-reading-long`。
- `raw/` 內素材檔名：`YYYY-MM-DD-主題.md` 或有意義的英文名，例如 `bestep-official-facts.md`。

## 5. `data/lessons.json` 格式

```json
{
  "site": { "title": "...", "examDate": "2026-11-21", "target": "B1+（85 分）", "repo": "GitHub 網址" },
  "lessons": [
    {
      "id": "01-reading-vocab",
      "file": "lessons/01-reading-vocab.html",
      "title": "閱讀第一部分：詞彙題",
      "skill": "reading",
      "part": "閱讀 Part 1",
      "minutes": 15,
      "summary": "一句話說明這單元學什麼（40 字內）",
      "updated": "2026-11-13"
    }
  ]
}
```

- 陣列順序 = 網站顯示順序 = 上一篇/下一篇的順序，必須和檔名編號一致。
- `skill` 決定標籤顏色：`overview` 灰、`reading` 綠、`listening` 橘、`vocab` 紫、`review` 藍。
- `minutes` 以 15 為原則（使用者每天練 15 分鐘），總覽可以短一點。
- 修改任何單元內容時，同步更新該筆的 `updated`。

## 6. 視覺風格：簡潔白底

- 白底、深灰字（`--text: #1f2937`），主色只有一個藍（`--accent: #2563eb`）。
- 內容寬度最多 760px，置中；手機也要能讀（style.css 已處理，不要另外寫）。
- 不用漸層、陰影最多用 `--shadow` 一種、不用 emoji 當標題裝飾（內文偶爾可以）。
- 顏色、間距一律用 `style.css` 最上方 `:root` 的變數；**不要改變數值**，除非使用者要求換風格。
- **刻意不放吉祥物或插圖**：這是備考工具，閱讀與作答要專心；也避免引用外部圖片（見第 2 節）。不要自行加入插圖。

## 7. 單元頁固定結構（每頁都要有、順序不可變）

每頁從 `templates/lesson-template.html` 複製。`<body>` 必須有 `data-lesson="單元 id"`，`lesson.js` 靠它產生上一篇/下一篇並記錄完成狀態。

| 順序 | 區塊 | HTML | 內容規則 |
|---|---|---|---|
| 0 | 頁首 | `<header class="lesson-head">` | 麵包屑、技能標籤、標題、資訊列（題型／題數／建議時間）。**「建議時間」指這個單元的學習時間，必須與 `lessons.json` 該筆的 `minutes` 相同**（一般為 `15 分鐘`，不要寫「約」或改成考試作答時間；考試時間分配只放在總覽單元） |
| 1 | 本單元重點 | `<section class="key-points">` | 3～5 點，每點一句話 |
| 2 | 題型解析 | `<section>` + `<h2>題型解析</h2>` | 這個部分考什麼、長什麼樣子；可用 `.table` |
| 3 | 解題步驟 | `<ol class="steps">` | 3～5 步，每步「動作＋原因」 |
| 4 | 例題練習 | `<section class="practice">` 內含 `.quiz` | **至少 3 題**，全部原創 |
| 5 | 常見陷阱 | `<ul class="traps">` | 2～4 點 |
| 6 | 今日 15 分鐘任務 | `<div class="task">` | 具體、可在 15 分鐘內完成的練習 |
| 7 | 資料來源 | `<section class="sources">` | 事實類資訊的出處連結；沒有就寫「本頁為原創練習」 |
| 8 | 頁尾 | `<nav class="pager" id="pager">` + `.done-toggle` | 內容留空，由 `lesson.js` 自動填入 |

## 8. 可用元件（只用這些，不要自創）

**重點框**
```html
<section class="key-points"><h2>本單元重點</h2><ul><li>…</li></ul></section>
```

**單選題**：`data-answer` 填正確選項字母。
```html
<div class="quiz" data-answer="B">
  <p class="q-stem"><span class="q-no">Q1</span> 題幹…</p>
  <div class="options">
    <button class="opt" data-key="A">A. …</button>
    <button class="opt" data-key="B">B. …</button>
    <button class="opt" data-key="C">C. …</button>
  </div>
  <div class="explain">說明：為什麼是 B、其他錯在哪。</div>
</div>
```

**複選題（5 選 2）**：`data-answer` 填多個字母（如 `"AD"`），並加 `data-multi`；`lesson.js` 會自動加「確認答案」按鈕。

**閱讀題組**：題組共用的文章放在 `<div class="passage">`，下面接多個 `.quiz`。

**長文閱讀單元（閱讀 Part 3 一類）的具體規格**：
- 文章 1 篇，約 250～350 字、4～5 段，放在**一個** `<div class="passage">`；段落用 `<p>`，需要時用 `<h3>` 當小標，不要用圖。
- 題組 **4～5 題**（至少仍須 3 題）：至少含 1 題主旨、1 題細節、1 題推論或詞義；可有 1 題複選。
- 「解題步驟」要包含「先掃讀標題與首尾句，再看題目回頭找答案段落」這類長文專用技巧，不要照抄短文單元。
- 文章主題為原創的校園／學術情境（例如研究計畫、課程制度、實習經驗）。

**參考範例**：不確定怎麼寫時，直接照 `lessons/01-reading-vocab.html`（單選＋解析）、`lessons/02-reading-short.html`（題組）、`lessons/03-listening-qa.html`（朗讀）的寫法，結構與命名保持一致。

**聽力朗讀**：用瀏覽器內建語音（Web Speech API）唸英文，不放音檔。
```html
<button class="speak" data-text="When is the deadline for the report?">▶ 播放題目</button>
```
`.speak` 放在題目 `.q-stem` 裡；聽力題**不要**把英文題目文字直接寫在頁面上，改放在 `.explain` 裡的「聽力原文」。

**表格**：`<table class="table">`；**陷阱清單**：`<ul class="traps">`；**任務框**：`<div class="task"><h2>今日 15 分鐘任務</h2>…</div>`。

## 9. 內容寫作規則

1. 說明用**繁體中文**；英文題目、選項、例句保持英文。
2. 例題**必須原創**，情境以大學校園、課堂、實驗室、實習為主（符合 BESTEP 學術導向）。**禁止抄錄官方或任何出版品的試題原文**。
3. 每題 `.explain` 要說明「為什麼對」＋「至少一個錯誤選項為什麼錯」。
4. 難度以 B1～B1+ 為主，可放 1 題 B2 挑戰題並在題幹標註「（挑戰）」。
5. 官方事實（題數、時間、分數）只能來自 `raw/bestep-official-facts.md`；要新增事實，先寫進 raw 並附來源網址，再引用到頁面。
6. 不確定的資訊不要寫成事實，寫成「建議」或直接省略。

## 10. 新增一個單元的 SOP（照順序做）

1. 讀本文件與 `data/lessons.json`，決定下一個編號 `NN`。
2. 若主題需要事實資料，先看 `raw/`；不夠就請使用者提供或上官方網站查，寫入 `raw/` 並附來源。
3. 複製 `templates/lesson-template.html` → `lessons/NN-skill-topic.html`。
4. 依第 7 節填滿每個區塊，替換所有 `{{…}}` 佔位文字。
5. 在 `data/lessons.json` 的 `lessons` 陣列**末端**新增一筆（或依編號插入）。
6. 跑第 12 節的驗收清單。
7. 回報：新增了哪些檔案、單元標題、練習題數。

## 11. 修改既有內容的規則

- 只改被要求的部分；不要順手重寫別的單元。
- 改到題目答案時，同時檢查 `data-answer` 和 `.explain` 是否一致。
- 要改全站樣式或元件行為時，先說明影響範圍並取得使用者同意。
- 不刪除單元；要下架就從 `lessons.json` 移除該筆並告知使用者。

## 12. 驗收清單（每次新增或修改後都要過）

- [ ] 檔名、`id`、`<body data-lesson>`、`lessons.json` 的 `id`/`file` 四者一致
- [ ] 頁首「建議時間」與 `lessons.json` 的 `minutes` 數字相同
- [ ] 第 7 節 0～8 區塊齊全且順序正確，沒有殘留 `{{`
- [ ] 至少 3 題練習，每題 `data-answer` 正確、選項 `data-key` 不重複
- [ ] 沒有外部網址資源、行內樣式、`<style>`、自寫 `<script>` 邏輯
- [ ] `lessons.json` 是合法 JSON（`python -m json.tool data/lessons.json`；沒有 Python 就用 `node -e "JSON.parse(require('fs').readFileSync('data/lessons.json','utf8'))"`）
- [ ] 開首頁，卡片出現、點進去上一篇/下一篇正常（預覽方式見第 2 節；**環境無法啟動伺服器時不可默默略過**，回報中要明講「此項未驗證，需使用者自行確認」）

## 13. 規則迭代紀錄（員工手冊會持續改寫）

> 每次發現 AI 做錯、或使用者提出新要求，就把「教訓」補成規則並記在這裡。AI 新增這一筆時，同步更新對應章節。

| 日期 | 發現的問題／新需求 | 補進哪一節 |
|---|---|---|
| 2026-11-13 | 初版：目的、技術限制、目錄、命名、固定結構、元件、SOP、驗收 | 全部 |
| 2026-11-13 | 對照課堂講義補上「交辦三件事」與「不要猜」規則，並註明刻意不放插圖 | 第 0、6 節 |
| 2026-11-13 | 實測時驗收腳本把出處超連結誤判為外部資源 → 明確區分「外部資源（禁止）」與「文字超連結（限資料來源／頁尾）」 | 第 2 節 |
| 2026-11-13 | 新對話實測（新增 04 長文閱讀）：AI 把頁首寫成「約 8 分鐘」，與 `lessons.json` 的 15 不一致；回頭檢查發現 01、02 也不一致 → 規定頁首「建議時間」＝`minutes`，並加進驗收清單 | 第 7、12 節 |
| 2026-11-13 | 新對話實測：環境沒有 Python，驗收的 JSON 檢查與預覽指令跑不動，AI 自行改用 node 驗證，但瀏覽器檢查被略過 → 補上 Node／npx 替代方案，並要求無法驗證的項目必須明講 | 第 2、12 節 |
| 2026-11-13 | 長文閱讀單元沒有具體規格，AI 容易照短文寫成太短 → 補上字數、題數與題型組成，並指定參考範例 | 第 8 節 |

## 14. 已知限制

- 朗讀功能依賴瀏覽器的英文語音；少數瀏覽器沒有英文語音時按鈕會顯示提示。
- 完成打勾存在瀏覽器 localStorage，換裝置不會同步。
