# 瑄瑄的學習樂園

四年級上學期互動學習網頁（純靜態、單一 HTML 檔、無外部相依），以 GitHub Pages 發布。
數學第 7～10 單元和社會第四、五單元的頁面，練習題直接讀 `review/bank.js`，和「今天的複習」用同一套題目。

## 結構

```
/                         首頁：科目選單（在 index.html 的 SUBJECTS 陣列新增科目）
/chinese/                 國語（第 1～6 課、1～6 課總複習）
/english/                 英語（Lesson 1～4、Review 1）
/nature/                  自然（在 LESSONS 陣列新增課程）
  moon-detective/         月亮小偵探（第一單元 閃亮的天空・月相）
  moon-phases/            月亮探險隊（第一單元 閃亮的天空・月相）
/social/                  社會（翰林版，在 LESSONS 陣列新增課程）
  reading-maps/           地圖探險王（第一單元 第1課 閱讀生活中的地圖）
  map-life/               地圖生活家（第一單元 第2課 善用地圖好生活）
  landforms/              地形探險家（第二單元 第1課 高低起伏的地形）
  climate/                氣候觀測站（第二單元 第2課 千變萬化的氣候）
  population/             人口觀察家（第三單元 第1課 家鄉的人口組成）
  population-change/      人口變化偵探（第三單元 第2課 人口變化與發展）
  multicultural/          多元文化博覽會（第四單元 家鄉的多元文化）
  festivals/              節慶禮俗月曆（第五單元 家鄉的節慶與禮俗）
/math/                    數學（康軒版，第 1～10 單元）
  big-numbers/ multiplication/ angles/ division/ kilometers/ triangles/   第 1～6 單元
  decimals/               小數積木工廠（第 7 單元 小數）
  mixed-ops/              算式小館（第 8 單元 整數四則計算）
  fractions/              分數烘焙坊（第 9 單元 分數）
  charts/                 統計圖小記者（第 10 單元 統計圖）
/phases/                  舊網址，自動轉到 /nature/moon-phases/
/review/                  今天的複習（國語、數學、自然、社會、英語的間隔＋交錯複習；題庫在 bank.js、排程在 srs.js）
                          最新更新 (2026-11-10)：新增氣/棄形近字、英語 half past、數學角度題型（量角器、分類、拖曳籃子）
/review-1031/ /mistakes/  考卷錯題複習
/docs/learning-design.md  學習設計說明（給爸媽和 Grok，改網站前先看）
```

所有連結都是相對路徑，可放在任何子路徑下（例如 `/moon-detective/`）。
`.nojekyll` 讓 GitHub Pages 直接提供檔案。
