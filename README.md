# 瑄瑄的學習樂園

四年級上學期互動學習網頁（純靜態、單一 HTML 檔、無外部相依），以 GitHub Pages 發布。

## 結構

```
/                         首頁：科目選單（在 index.html 的 SUBJECTS 陣列新增科目）
/nature/                  自然（在 LESSONS 陣列新增課程）
  moon-detective/         月亮小偵探（第一單元 閃亮的天空・月相）
  moon-phases/            瑄瑄的月亮探險隊（第一單元 閃亮的天空・月相）
/social/                  社會
  reading-maps/           地圖探險王（第一單元 家鄉的地圖與運用・第1課 閱讀生活中的地圖）
/phases/                  舊網址，自動轉到 /nature/moon-phases/
```

所有連結都是相對路徑，可放在任何子路徑下（例如 `/moon-detective/`）。
`.nojekyll` 讓 GitHub Pages 直接提供檔案。
