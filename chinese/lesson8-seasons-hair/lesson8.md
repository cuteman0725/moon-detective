# 第八課「四季的頭髮」技術文件

## 系統架構

### 類別圖 (Class Diagram)

```mermaid
classDiagram
    class Core {
        +Array~Char~ CHARS
        +Array~Overlap~ OVERLAP
        +Array~Question~ READ
        +Array~Pattern~ PAT
        +Object BADGE
        +Array~Tab~ TABS
        +String POEM
        +initData()
    }
    
    class Char {
        +String c
        +String zy
        +String bs
        +Number tot
        +Array~String~ ww
        +String ex
    }
    
    class Overlap {
        +String txt
        +String ex
    }
    
    class Question {
        +String q
        +Array~String~ op
        +Number a
        +String ex
    }
    
    class Pattern {
        +String q
        +String a
        +String ex
    }
    
    class AppState {
        +String mode
        +Number curr
        +Array~Answer~ ans
        +Object bestRec
        +loadState()
        +saveState()
        +reset()
    }
    
    class UIController {
        +renderGrid()
        +showChar()
        +showTab()
        +runQuiz()
        +updateScore()
    }
    
    class CanvasController {
        +initCanvas()
        +clearPad()
        +handleTouch()
        +handleMouse()
    }
    
    Core "1" --> "*" Char : contains
    Core "1" --> "*" Overlap : contains
    Core "1" --> "*" Question : contains
    Core "1" --> "*" Pattern : contains
    AppState --> UIController : updates
    UIController --> CanvasController : uses
    UIController --> Core : reads
```

### 流程圖 (Flowchart) - 學習流程

```mermaid
flowchart TD
    A[開始] --> B[載入儲存資料]
    B --> C{選擇學習模式}
    
    C -->|課文| D[顯示詩的內容]
    C -->|生字| E[生字網格]
    C -->|語詞| F[疊字詞列表]
    C -->|句型| G[句型練習]
    C -->|挑戰| H[綜合測驗]
    C -->|紀錄| I[學習統計]
    
    E --> E1[點擊生字]
    E1 --> E2[顯示詳細資料]
    E2 --> E3[描寫板練習]
    E3 --> E4[儲存進度]
    E4 --> E
    
    F --> F1[選擇疊字詞]
    F1 --> F2[顯示例句]
    F2 --> F
    
    G --> G1[顯示題目]
    G1 --> G2[選擇答案]
    G2 --> G3{是否正確?}
    G3 -->|是| G4[顯示正確說明]
    G3 -->|否| G5[顯示錯誤提示]
    G4 --> G6[下一題]
    G5 --> G6
    G6 --> G7{還有題目?}
    G7 -->|是| G1
    G7 -->|否| G8[顯示分數]
    
    H --> H1[開始綜合測驗]
    H1 --> H2[顯示題目]
    H2 --> H3[選擇答案]
    H3 --> H4{是否正確?}
    H4 -->|是| H5[分數+1]
    H4 -->|否| H6[顯示說明]
    H5 --> H7[下一題]
    H6 --> H7
    H7 --> H8{還有題目?}
    H8 -->|是| H2
    H8 -->|否| H9[計算總分]
    H9 --> H10[檢查徽章]
    H10 --> H11[儲存最佳紀錄]
    
    I --> I1[顯示統計資料]
    I1 --> I2[顯示獲得徽章]
    I2 --> I3[顯示最佳分數]
    
    D --> C
    E4 --> C
    F2 --> C
    G8 --> C
    H11 --> C
    I3 --> C
```

### 循環圖 (Sequence Diagram) - 答題互動

```mermaid
sequenceDiagram
    participant U as 使用者
    participant UI as UIController
    participant State as AppState
    participant Core as CoreData
    participant LS as localStorage
    
    U->>UI: 點擊「挑戰」分頁
    UI->>State: 初始化測驗狀態
    State->>Core: 取得題目資料
    Core-->>State: 返回題目陣列
    State-->>UI: 返回第一題
    UI->>U: 顯示題目和選項
    
    loop 每一題
        U->>UI: 選擇答案
        UI->>State: 記錄答案
        State->>Core: 檢查正確答案
        Core-->>State: 返回是否正確
        State-->>UI: 返回結果和說明
        UI->>U: 顯示回饋
        
        alt 答對
            UI->>U: 綠色勾勾 + 說明
        else 答錯
            UI->>U: 紅色叉叉 + 說明
        end
        
        U->>UI: 點擊「下一題」
        UI->>State: 取得下一題
    end
    
    State->>State: 計算總分
    State->>Core: 檢查徽章條件
    Core-->>State: 返回獲得徽章
    State->>LS: 儲存最佳紀錄
    LS-->>State: 儲存成功
    State-->>UI: 返回結果
    UI->>U: 顯示分數和徽章
```

### Use Case 圖

```mermaid
graph TB
    subgraph 學習者
        U[小學生]
    end
    
    subgraph 系統功能
        UC1[閱讀課文]
        UC2[學習生字]
        UC3[練習疊字詞]
        UC4[練習句型]
        UC5[完成挑戰]
        UC6[查看紀錄]
        UC7[描寫生字]
        UC8[複習錯誤]
    end
    
    U -->|閱讀| UC1
    U -->|學習| UC2
    U -->|練習| UC3
    U -->|應用| UC4
    U -->|測驗| UC5
    U -->|追蹤| UC6
    
    UC2 -->|包含| UC7
    UC5 -->|延伸| UC8
    
    UC1 -.->|先閱讀| UC2
    UC2 -.->|再學詞| UC3
    UC3 -.->|後學句型| UC4
    UC4 -.->|最後測驗| UC5
```

### 資料結構 (Database DD)

```mermaid
erDiagram
    CORE-DATA {
        array CHARS "15個生字"
        array OVERLAP "6個疊字詞"
        array READ "10題詩的理解"
        array PAT "4題句型練習"
        object BADGE "徽章定義"
        array TABS "6個分頁"
        string POEM "課文詩"
    }
    
    CHAR {
        string c "生字"
        string zy "注音"
        string bs "部首"
        number tot "筆畫數"
        array ww "造詞"
        string ex "例句"
    }
    
    OVERLAP {
        string txt "疊字詞"
        string ex "例句說明"
    }
    
    QUESTION {
        string q "題目"
        array op "選項(4個)"
        number a "正確答案索引"
        string ex "說明"
    }
    
    PATTERN {
        string q "題目"
        string a "正確答案"
        string ex "說明"
    }
    
    APP-STATE {
        string mode "當前模式"
        number curr "當前題號"
        array ans "答案記錄"
        object bestRec "最佳紀錄"
    }
    
    LOCAL-STORAGE {
        string key "zhSeasonsHairV1"
        object data "序列化的AppState"
    }
    
    CORE-DATA ||--o{ CHAR : contains
    CORE-DATA ||--o{ OVERLAP : contains
    CORE-DATA ||--o{ QUESTION : contains
    CORE-DATA ||--o{ PATTERN : contains
    APP-STATE ||--|| LOCAL-STORAGE : persists
```

### ER Model - 學習紀錄關聯

```mermaid
erDiagram
    LESSON ||--o{ CHAR : contains
    LESSON ||--o{ OVERLAP : contains
    LESSON ||--o{ QUIZ : contains
    LESSON ||--|| PROGRESS : tracks
    
    LESSON {
        string id "lesson8"
        string title "四季的頭髮"
        number unit "3"
    }
    
    CHAR {
        string char "生字"
        string zhuyin "注音"
        string radical "部首"
        number strokes "筆畫"
    }
    
    OVERLAP {
        string word "疊字詞"
        string example "例句"
    }
    
    QUIZ {
        string type "題目類型"
        string question "題目"
        array options "選項"
        number answer "答案"
    }
    
    PROGRESS {
        number score "分數"
        array badges "徽章"
        datetime lastStudy "最後學習時間"
        object bestRecord "最佳紀錄"
    }
    
    PROGRESS ||--o{ BADGE : earns
    
    BADGE {
        string id "徽章ID"
        string name "徽章名稱"
        string emoji "表情符號"
        datetime earnedAt "獲得時間"
    }
```

## 狀態管理

### 狀態轉換圖

```mermaid
stateDiagram-v2
    [*] --> 載入中
    載入中 --> 課文頁: 預設進入
    
    課文頁 --> 生字頁: 點擊生字分頁
    課文頁 --> 語詞頁: 點擊語詞分頁
    課文頁 --> 句型頁: 點擊句型分頁
    課文頁 --> 挑戰頁: 點擊挑戰分頁
    課文頁 --> 紀錄頁: 點擊紀錄分頁
    
    生字頁 --> 生字詳細: 點擊生字卡
    生字詳細 --> 描寫板: 點擊描寫板
    描寫板 --> 生字詳細: 完成描寫
    生字詳細 --> 生字頁: 返回
    
    語詞頁 --> 語詞練習: 開始練習
    語詞練習 --> 語詞結果: 完成練習
    語詞結果 --> 語詞頁: 返回
    
    句型頁 --> 句型練習: 開始練習
    句型練習 --> 句型結果: 完成練習
    句型結果 --> 句型頁: 返回
    
    挑戰頁 --> 綜合測驗: 開始挑戰
    綜合測驗 --> 測驗結果: 完成10題
    測驗結果 --> 徽章獲得: 達成條件
    徽章獲得 --> 挑戰頁: 返回
    測驗結果 --> 挑戰頁: 未達成
    
    紀錄頁 --> 課文頁: 返回
    
    生字頁 --> 課文頁: 切換分頁
    語詞頁 --> 課文頁: 切換分頁
    句型頁 --> 課文頁: 切換分頁
    挑戰頁 --> 課文頁: 切換分頁
    紀錄頁 --> 課文頁: 切換分頁
```

## 技術實作細節

### 主要檔案

1. **index.html**
   - 定義 Core 資料物件
   - 包含課文、生字、語詞、句型、測驗資料
   - 定義徽章系統規則
   - HTML 結構 (6 個分頁)

2. **app.js**
   - 狀態管理 (localStorage: zhSeasonsHairV1)
   - UI 控制器
   - Canvas 描寫板邏輯
   - 測驗邏輯
   - 分數計算
   - 徽章檢查

### localStorage 資料結構

```javascript
{
  "mode": "poem|chars|overlap|pattern|quiz|rec",
  "curr": 0,
  "ans": [],
  "bestRec": {
    "score": 10,
    "badges": ["詩人", "觀察家", "語言大師", "四季通"],
    "date": "2026-11-18T10:30:00.000Z"
  }
}
```

### 徽章系統

| 徽章 | 條件 | 符號 |
|------|------|------|
| 詩人 | 詩的理解全對 | 📖 |
| 觀察家 | 生字題全對 | 🔍 |
| 語言大師 | 疊字詞題全對 | 💬 |
| 四季通 | 挑戰滿分 | 🌟 |

### 題目類型

1. **生字題** (3題): 從課文句子選出正確的生字
2. **疊字詞題** (2題): 選擇正確的疊字詞填空
3. **句型題** (2題): 「不得不」句型應用
4. **詩理解題** (3題): 理解詩的內容和意象

### 分頁結構

```
┌─────────────────────────────┐
│  課文 生字 語詞 句型 挑戰 紀錄 │
├─────────────────────────────┤
│                             │
│        [當前分頁內容]         │
│                             │
│                             │
└─────────────────────────────┘
```

## 響應式設計

- 最小寬度: 390px (iPhone 12 Pro)
- 中等寬度: 768px (iPad)
- 大螢幕: 1024px+ (桌面)

## 未來擴充

1. **語音功能**: 播放生字發音
2. **動畫效果**: 筆順動畫
3. **社交功能**: 分享學習成果
4. **進階分析**: 學習曲線圖表
5. **錯題本**: 自動收集錯誤題目

---

**建立日期**: 2026-11-18  
**版本**: 1.0  
**南一版**: 四年級上冊 第八課
