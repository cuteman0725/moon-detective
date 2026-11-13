# 國語第七課《到此「藝」遊》系統設計

## 類別圖 (Class Diagram)

```mermaid
classDiagram
    class Core {
        +Array~CHARS~ 生字陣列
        +Object BSFORM 部首常見寫法
        +Object IDIOMS 成語解釋
        +Array~LOOK~ 形近字題目
        +Array~WORDS~ 語詞陣列
        +Array~FILL~ 選詞填空
        +Array~READ~ 閱讀理解
        +Array~STEPS~ 參觀順序
        +Array~PARTS~ 文章結構
        +Array~SENSE~ 看到的＋感受
        +Array~ECHO~ 首尾呼應
        +Array~RHET~ 修辭判斷
        +Array~SORT~ 地點分類
        +Array~LOCS~ 地點列表
        +Array BADGES 徽章列表
        +shuffle(array) 洗牌
        +pick(array, n) 隨機選取
        +charBy(c) 查詢生字
        +charQ(type, ch) 生字題目
        +challenges() 綜合挑戰
        +matchCheck(word, meaning) 配對檢查
        +sortCheck(text, loc) 分類檢查
        +stars(correct, total) 計算星星
        +badges(store) 計算徽章
    }

    class App {
        +Object store localStorage 存儲
        +Function save() 儲存進度
        +Function renderScore() 顯示分數
        +Function addStars(n, el) 加星星動畫
        +Function beep(good) 音效
        +Function say(text) 語音播報
        +Function goTab(page) 切換頁面
        +Function runQuiz(boxId, make, opt) 測驗系統
    }

    class CharModule {
        +Object cur 當前生字
        +Function renderGrid() 渲染生字格
        +Function showChar(ch, tap) 顯示生字卡
        +Function clearPad() 清除描寫板
        +HTMLCanvasElement pad 描寫板
    }

    class Quiz {
        +Array items 題目列表
        +Number i 當前題號
        +Number right 答對數
        +Function start() 開始測驗
        +Function draw() 繪製題目
        +Function pickAns(btn, op) 選擇答案
        +Function finish() 結束測驗
    }

    class StepGame {
        +Number done 完成數量
        +Number errs 錯誤次數
        +Function draw() 繪製遊戲
        +Function startStep() 開始排序遊戲
    }

    class SortGame {
        +Object placed 已放置項目
        +Number i 當前項目
        +Number errs 錯誤次數
        +Function draw() 繪製分類
        +Function startSort() 開始分類遊戲
    }

    Core <-- App : 使用資料
    App --> CharModule : 管理生字
    App --> Quiz : 執行測驗
    App --> StepGame : 執行排序
    App --> SortGame : 執行分類
```

## 資料流程圖 (Data Flow)

```mermaid
flowchart TD
    A[使用者進入課程] --> B{選擇頁籤}
    B -->|📖 課文| C[課文導讀]
    B -->|✍️ 生字| D[生字學習]
    B -->|🧩 語詞| E[語詞學習]
    B -->|🪄 句型| F[句型練習]
    B -->|🎮 挑戰| G[挑戰活動]
    B -->|🏆 紀錄| H[學習紀錄]

    C --> C1[🔊 聽導讀]
    C --> C2[🚶 參觀順序排列]
    C --> C3[🧱 文章結構配對]
    C --> C4[🔍 閱讀理解測驗]

    D --> D1[點選生字卡]
    D --> D2[🖌️ 描寫板練習]
    D --> D3[🧠 生字小測驗]
    D --> D4[👀 形近字選擇]
    D1 --> D1a[顯示注音/部首/筆畫]
    D1 --> D1b[造詞與例句]
    D1 --> D1c[🔊 念一念]
    D1 --> D1d[🎬 看筆順動畫]

    D2 --> D2a{描寫墨水足夠?}
    D2a -->|是| D2b[✅ 寫好了 +1⭐]
    D2a -->|否| D2c[❌ 先描一描]

    D3 --> D3a[選擇測驗類型]
    D3a --> D3b[部首測驗]
    D3a --> D3c[筆畫測驗]
    D3a --> D3d[注音測驗]

    E --> E1[🧩 語詞配對]
    E --> E2[📝 選詞填空]
    E --> E3[📚 語詞小卡瀏覽]
    E --> E4[💡 生字延伸成語]

    E1 --> E1a[選左邊語詞]
    E1 --> E1b[選右邊意思]
    E1b --> E1c{配對正確?}
    E1c -->|是| E1d[✅ 答對 +⭐]
    E1c -->|否| E1e[❌ 再想想]
    E1d --> E1f{全部配對完?}
    E1f -->|是| E1g[🎉 完成 +1-3⭐]

    F --> F1[看到的＋感受]
    F --> F2[首尾呼應]
    F --> F3[修辭判斷]

    G --> G1[🏛️ 地點分類大挑戰]
    G --> G2[🏆 綜合挑戰 10題]
    G1 --> G1a{分類正確?}
    G1a -->|是| G1b[✅ +1⭐ 繼續]
    G1a -->|否| G1c[❌ 不是這個地點]
    G1b --> G1d{全部完成?}
    G1d -->|是| G1e[🎉 錯0次 +4⭐<br>錯1-2次 +2⭐<br>錯3+次 +1⭐]

    H --> H1[查看統計數據]
    H --> H2[查看徽章獲得]
    H --> H3[查看常錯題目]
    H --> H4[清除紀錄]

    style C fill:#ffe6ef
    style D fill:#d8f3dc
    style E fill:#cfe8ff
    style F fill:#fff4c2
    style G fill:#ffd6dc
    style H fill:#e3f6ec
```

## 狀態機圖 (State Machine) - 測驗流程

```mermaid
stateDiagram-v2
    [*] --> 初始化: 載入題目
    初始化 --> 顯示題目: 洗牌完成
    顯示題目 --> 等待作答: 渲染選項
    等待作答 --> 判斷答案: 點選選項
    判斷答案 --> 答對: 答案正確
    判斷答案 --> 答錯: 答案錯誤
    答對 --> 加星星: +1⭐
    答錯 --> 記錄錯誤: miss(type)
    加星星 --> 檢查進度: 顯示下一題按鈕
    記錄錯誤 --> 檢查進度: 顯示下一題按鈕
    檢查進度 --> 顯示題目: 還有題目
    檢查進度 --> 顯示成績: 測驗完成
    顯示成績 --> 計算星星: 依答對率
    計算星星 --> 顯示徽章: 檢查解鎖條件
    顯示徽章 --> [*]: 再玩一次/離開
```

## 循環圖 (Sequence) - 參觀順序排列流程

```mermaid
sequenceDiagram
    participant U as 使用者
    participant G as 遊戲介面
    participant L as 邏輯判斷
    participant S as 計分系統
    participant D as 資料儲存

    U->>G: 進入挑戰頁面
    G->>L: 初始化遊戲
    L->>L: 洗牌 7 個站點
    L->>G: 顯示亂序按鈕
    G->>U: 呈現選項

    loop 每個站點
        U->>G: 點選一個站點
        G->>L: 檢查順序
        alt 順序正確
            L->>L: done++
            L->>S: beep(true)
            S->>G: ✅ 音效 + 動畫
            G->>U: 按鈕變灰（已完成）
        else 順序錯誤
            L->>L: errs++
            L->>S: beep(false)
            S->>G: ❌ 音效 + 提示
            G->>U: 「順序不太對，再看看課文！」
        end
    end

    L->>L: 檢查是否完成
    alt 全部完成
        L->>S: 計算星星<br>錯0次 +4⭐<br>錯1-2次 +2⭐<br>錯3+次 +1⭐
        S->>D: 儲存 stepDone++<br>stepPerfect++ (if 錯0)
        D->>G: 更新顯示
        G->>U: 🎉 完成訊息 + 再玩一次
    end
```

## UseCase 圖 (Use Case)

```mermaid
flowchart LR
    subgraph 國語第七課系統
        UC1[📖 閱讀課文導讀]
        UC2[🔊 聽導讀語音]
        UC3[🚶 排列參觀順序]
        UC4[✍️ 學習生字]
        UC5[🖌️ 描寫生字]
        UC6[🧩 語詞配對]
        UC7[📝 選詞填空]
        UC8[🪄 句型練習]
        UC9[🏛️ 地點分類]
        UC10[🏆 綜合挑戰]
        UC11[📊 查看紀錄]
    end

    U1((四年級學生))
    U2((家長))

    U1 --> UC1
    U1 --> UC2
    U1 --> UC3
    U1 --> UC4
    U1 --> UC5
    U1 --> UC6
    U1 --> UC7
    U1 --> UC8
    U1 --> UC9
    U1 --> UC10
    U1 --> UC11

    U2 --> UC11

    UC4 -.includes.-> UC5
    UC8 -.extends.-> UC4
    UC10 -.includes.-> UC4
    UC10 -.includes.-> UC6
    UC10 -.includes.-> UC8
```

## 資料庫設計 (Database DD / ER Model)

本系統使用前端 **localStorage** 儲存，無後端資料庫。

### localStorage 資料結構

```mermaid
erDiagram
    LESSON7_STORE {
        int stars "累積星星數"
        int readBest "閱讀理解最佳成績"
        object seen "看過的生字 {字:1}"
        object wrote "描寫過的字 {字:1}"
        int matchDone "完成語詞配對次數"
        object pat "完成的句型練習 {類型:1}"
        int stepDone "完成參觀順序次數"
        int stepPerfect "參觀順序全對次數"
        int locPerfect "地點分類全對次數"
        int chBest "綜合挑戰最佳成績"
        object bad "錯誤統計 {類型:次數}"
        object best "最佳成績 {類型:分數}"
    }

    CORE_DATA {
        string c "生字"
        string zy "注音"
        string bs "部首"
        int tot "總筆畫"
        array w "造詞"
        string tx "課文例句"
        string idiom "相關成語"
        string look "形近字"
    }

    REVIEW_CARDS {
        string id "卡片ID cn7:字"
        string s "科目 cn"
        string u "單元 cn7"
        string type "類型 write/spot/drag"
        string c "生字"
        string zy "注音"
        string bs "部首"
        int tot "總筆畫"
        array w "造詞"
        string tx "課文例句"
    }

    LESSON7_STORE ||--o{ CORE_DATA : "references"
    REVIEW_CARDS ||--o{ CORE_DATA : "generates from"
```

### localStorage Key

- **zhArtTourV1**: 第七課學習進度和統計
- **studyReviewV1**: 全站複習系統（未更動）
- **studyBackupAt**: 備份時間戳（未更動）

## 系統架構說明

### 前端技術棧
- **HTML5**: 語意化標籤、Canvas API（描寫板）
- **CSS3**: Flexbox/Grid 響應式佈局、動畫效果
- **Vanilla JavaScript**: 無框架、純原生 JS
- **Web Speech API**: 語音播報功能
- **Web Audio API**: 答題音效
- **localStorage**: 客戶端資料持久化

### 核心模組

1. **Core 模組** (`index.html <script id="core">`)
   - 資料定義：生字、詞語、題目
   - 工具函數：洗牌、隨機選取、檢查答案

2. **App 模組** (`app.js`)
   - 狀態管理：localStorage 讀寫
   - 互動邏輯：點擊、拖曳事件
   - 視覺回饋：星星動畫、音效、語音

3. **測驗系統** (`runQuiz`)
   - 通用測驗框架
   - 進度追蹤
   - 成績計算

4. **遊戲模組**
   - 參觀順序排列 (`startStep`)
   - 地點分類 (`startSort`)
   - 語詞配對 (`startMatch`)

### 設計模式

- **模組化**: Core 和 App 分離，職責清晰
- **工廠模式**: `runQuiz` 生成各種測驗
- **狀態模式**: 測驗流程的狀態轉換
- **策略模式**: 不同題型的判斷邏輯

### 響應式設計

- 基準寬度：390px (iPhone 12 mini)
- 最大寬度：1000px (桌面)
- 字體：clamp() 動態縮放
- 佈局：Grid auto-fit 自適應

### 無障礙設計

- 語意化 HTML 標籤
- ARIA labels 生字按鈕
- 鍵盤導航支援（按鈕 focus）
- 高對比度色彩搭配

## 檔案結構

```
chinese/lesson7-art-tour/
├── index.html          # 主頁面（含 Core 模組）
├── app.js              # 應用邏輯
└── lesson7.md          # 本文檔（Mermaid 圖表）
```

## 複習系統整合

本課程整合到 `review/bank.js` 複習題庫：

### 卡片類型
1. **write** - 看注音寫國字（15 張）
   - ID: `cn7:育`, `cn7:晴`, ...
   - 主動回想，無選項

2. **spot** - 改錯字（5 張）
   - ID: `cnx7:晴:睛`, `cnx7:陶:淘`, ...
   - 點出句子中的錯字

3. **drag** - 部件拼字（4 張）
   - ID: `cnd:晴`, `cnd:陶`, ...
   - 拖曳部首和部件拼字

### 複習演算法

- **間隔重複**: 答對隔 2, 4, 7, 14, 30 天
- **交錯練習**: 國語、數學、自然混合出題
- **錯題強化**: 答錯隔天再來、變成小怪物

## 教學設計原則

✅ **課本內容優先**: 南一版四上第七課  
✅ **主動回想**: Canvas 描寫、部件拼字無選項  
✅ **立即回饋**: 答對/答錯動畫、音效、說明  
✅ **情境學習**: 遊記路線、地點分類體驗空間感  
✅ **遊戲化**: 參觀順序排列、地點分類挑戰  
✅ **記憶樹整合**: 生字卡片進入複習系統

## 資料來源與引用

- 南一版國語四上第七課課本
- [Like創思拾光書坊教案](https://likethinking.com/blog/guo-wen-nanyi-4017)
- 北新國小黃崇劭老師教案
- 教育部筆順學習網（外部連結）
