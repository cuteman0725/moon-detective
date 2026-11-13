# 自然第三單元《物質變變變》系統設計

## 類別圖 (Class Diagram)

```mermaid
classDiagram
    class App {
        +Object store localStorage 存儲
        +Number stars 累積星星
        +Function save() 儲存進度
        +Function renderScore() 顯示分數
        +Function addStars(n) 加星星動畫
        +Function beep(good) 音效
        +Function goTab(page) 切換頁面
    }

    class SortGame {
        +Array~CHANGES~ 變化列表
        +Array sortItems 洗牌後的項目
        +Number sortDone 完成數量
        +Number sortErrs 錯誤次數
        +Function shuffle(array) 洗牌
        +Function checkSort(item, binType) 檢查分類
    }

    class TempLab {
        +Number temperature 當前溫度
        +Function setTemp(t) 設定溫度
        +Function updateTemp() 更新顯示
        +Array~TEMP_Q~ 溫度測驗題目
        +Number tq 當前題號
        +Number tqRight 答對數
        +Function drawTQ() 繪製測驗
        +Function answerTQ(ans) 回答測驗
    }

    class PhLab {
        +Array~TESTS~ 測試物質列表
        +Number phDone 完成測試數
        +Function testSubstance(name) 測試物質
    }

    class Record {
        +Number sortDone 分類完成次數
        +Number sortPerfect 分類全對次數
        +Number tempQ 溫度測驗次數
        +Number phDone 酸鹼測試次數
        +Function renderRec() 渲染紀錄
    }

    App --> SortGame : 管理分類遊戲
    App --> TempLab : 管理溫度實驗
    App --> PhLab : 管理酸鹼測試
    App --> Record : 管理學習紀錄
```

## 資料流程圖 (Data Flow)

```mermaid
flowchart TD
    A[使用者進入課程] --> B{選擇頁籤}
    B -->|📚 介紹| C[單元介紹]
    B -->|⚗️ 分類| D[物理化學變化分類]
    B -->|🌡️ 溫度| E[溫度實驗室]
    B -->|🧪 酸鹼| F[酸鹼測試]
    B -->|🏆 紀錄| G[學習紀錄]

    D --> D1[拖曳或點選物質變化]
    D1 --> D2{分類正確?}
    D2 -->|是| D3[✅ +1⭐ 放入籃子]
    D2 -->|否| D4[❌ 搖動提示]
    D3 --> D5{全部完成?}
    D5 -->|是| D6[計算總星星<br>錯0次 +4⭐<br>錯1-2次 +2⭐<br>錯3+次 +1⭐]

    E --> E1[拖動溫度計滑桿]
    E1 --> E2[更新溫度顯示]
    E2 --> E3{溫度範圍}
    E3 -->|< 0°C| E4[🧊 固態冰<br>水銀柱下降]
    E3 -->|0-100°C| E5[💧 液態水<br>水銀柱中等]
    E3 -->|> 100°C| E6[♨️ 氣態水蒸氣<br>水銀柱上升]
    E6 --> E7[溫度小測驗]
    E7 --> E8[3 題選擇題]
    E8 --> E9[計算得分<br>全對 +3⭐<br>2題 +2⭐<br>1題 +1⭐]

    F --> F1[點選測試物質]
    F1 --> F2[紫高麗菜汁變色]
    F2 --> F3{物質類型}
    F3 -->|酸性| F4[🔴 變紅色<br>檸檬汁、醋]
    F3 -->|鹼性| F5[🟢 變綠色<br>小蘇打、肥皂]
    F3 -->|中性| F6[🟣 保持紫色<br>清水]
    F6 --> F7[顯示科學解釋<br>+1⭐]

    G --> G1[查看完成統計]
    G --> G2[清除紀錄]

    style D fill:#e3f8ff
    style E fill:#ffe6ef
    style F fill:#d8f3dc
    style G fill:#fff7d6
```

## 狀態機圖 (State Machine) - 分類遊戲流程

```mermaid
stateDiagram-v2
    [*] --> 初始化: 載入變化列表
    初始化 --> 洗牌: 10個變化
    洗牌 --> 等待拖曳: 顯示項目和籃子
    等待拖曳 --> 拖曳中: 按住項目
    等待拖曳 --> 點選模式: 點選項目
    拖曳中 --> 放入籃子: 拖到籃子上方
    點選模式 --> 點選籃子: 籃子高亮
    點選籃子 --> 檢查分類: 判斷正確性
    放入籃子 --> 檢查分類: 判斷正確性
    檢查分類 --> 答對: 分類正確
    檢查分類 --> 答錯: 分類錯誤
    答對 --> 更新進度: 項目變灰+移到籃子內
    答錯 --> 搖動提示: 項目搖動+錯誤訊息
    更新進度 --> 檢查完成: 已完成/總數
    搖動提示 --> 等待拖曳: 繼續遊戲
    檢查完成 --> 等待拖曳: 還有項目
    檢查完成 --> 計算星星: 全部完成
    計算星星 --> 顯示成績: 錯誤次數決定星星
    顯示成績 --> [*]: 結束
```

## 循環圖 (Sequence) - 溫度實驗互動流程

```mermaid
sequenceDiagram
    participant U as 使用者
    participant S as 滑桿
    participant T as 溫度顯示
    participant M as 水銀柱
    participant I as 狀態圖示
    participant P as 說明文字

    U->>S: 拖動滑桿
    S->>T: 更新溫度值
    T->>T: 計算溫度範圍
    
    alt 溫度 < 0°C
        T->>I: 顯示 🧊 固態冰
        T->>M: 水銀柱下降
        T->>P: "溫度低於 0°C..."
    else 溫度 0-100°C
        T->>I: 顯示 💧 液態水
        T->>M: 水銀柱中等高度
        T->>P: "溫度在 0°C~100°C..."
    else 溫度 > 100°C
        T->>I: 顯示 ♨️ 氣態水蒸氣
        T->>M: 水銀柱上升
        T->>P: "溫度高於 100°C..."
    end

    I->>U: 視覺回饋
    M->>U: 動畫過渡
    P->>U: 文字說明

    Note over U,P: 0.5秒平滑過渡動畫

    U->>U: 繼續實驗<br>或進入測驗
```

## UseCase 圖 (Use Case)

```mermaid
flowchart LR
    subgraph 物質變變變系統
        UC1[📚 閱讀單元介紹]
        UC2[⚗️ 物理化學變化分類]
        UC3[🌡️ 調整溫度觀察變化]
        UC4[📝 溫度小測驗]
        UC5[🧪 酸鹼測試實驗]
        UC6[📊 查看學習紀錄]
        UC7[🗑️ 清除紀錄]
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

    U2 --> UC6

    UC3 -.includes.-> UC4
    UC2 -.extends.-> UC6
    UC5 -.extends.-> UC6
```

## 資料庫設計 (Database DD / ER Model)

本系統使用前端 **localStorage** 儲存，無後端資料庫。

### localStorage 資料結構

```mermaid
erDiagram
    MATTER_STORE {
        int stars "累積星星數"
        int sortDone "完成分類次數"
        int tempQ "完成溫度測驗次數"
        int phDone "完成酸鹼測試次數"
        int sortPerfect "分類全對次數"
    }

    CHANGES_DATA {
        string t "變化描述"
        string type "類型 physical/chemical"
    }

    TEMP_QUIZ {
        string q "問題"
        string a "答案"
        array o "選項"
        string exp "說明"
    }

    PH_TESTS {
        string n "物質名稱"
        string ph "酸鹼性質 酸/鹼/中"
        string color "燒杯顏色代碼"
        string exp "科學解釋"
    }

    MATTER_STORE ||--o{ CHANGES_DATA : "references"
    MATTER_STORE ||--o{ TEMP_QUIZ : "references"
    MATTER_STORE ||--o{ PH_TESTS : "references"
```

### localStorage Key

- **natureMatterV1**: 第三單元學習進度和統計

### 資料項目

**物理化學變化 (CHANGES)**
```javascript
[
  {t:"冰塊融化成水", type:"physical"},
  {t:"木頭燃燒", type:"chemical"},
  // ... 共 10 個
]
```

**溫度測驗 (TEMP_Q)**
```javascript
[
  {
    q:"冰塊放在室溫下會融化成水，這是什麼變化？",
    a:"物理變化",
    o:["物理變化","化學變化"],
    exp:"冰融化成水是物理變化，因為可以再結冰回來。"
  },
  // ... 共 3 題
]
```

**酸鹼測試物質 (TESTS)**
```javascript
[
  {
    n:"檸檬汁",
    ph:"酸",
    color:"#ff9fb8",
    exp:"檸檬汁含檸檬酸，是酸性（pH < 7）。"
  },
  // ... 共 5 種
]
```

## 流程圖 (Flowchart) - 分類判斷邏輯

```mermaid
flowchart TD
    Start[開始分類] --> Input[使用者選擇變化項目]
    Input --> Drag{操作方式}
    Drag -->|拖曳| DragTo[拖到籃子上方]
    Drag -->|點選| Click1[點選項目高亮]
    DragTo --> Drop[放開]
    Click1 --> Click2[點選目標籃子]
    Drop --> Check{檢查分類}
    Click2 --> Check
    
    Check -->|正確| Correct[項目變灰]
    Check -->|錯誤| Wrong[項目搖動]
    
    Correct --> Sound1[播放成功音效]
    Wrong --> Sound2[播放錯誤音效]
    
    Sound1 --> Move[移到籃子內]
    Sound2 --> Msg[顯示錯誤訊息]
    
    Move --> Count1[完成數+1]
    Msg --> Count2[錯誤數+1]
    
    Count1 --> CheckAll{全部完成?}
    Count2 --> CheckAll
    
    CheckAll -->|否| Input
    CheckAll -->|是| CalcStars[計算星星]
    
    CalcStars --> Stars{錯誤次數}
    Stars -->|0 次| Award4[+4⭐<br>全對獎勵]
    Stars -->|1-2 次| Award2[+2⭐]
    Stars -->|3+ 次| Award1[+1⭐]
    
    Award4 --> Perfect[標記全對]
    Award2 --> Save[儲存進度]
    Award1 --> Save
    Perfect --> Save
    
    Save --> End[顯示完成訊息]
```

## 系統架構說明

### 前端技術棧
- **HTML5**: 語意化標籤、range input（溫度滑桿）
- **CSS3**: 
  - Flexbox/Grid 響應式佈局
  - CSS Variables（顏色主題）
  - transition/animation（平滑過渡、搖動效果）
- **Vanilla JavaScript**: 無框架、純原生 JS
- **Web Audio API**: 答題音效
- **localStorage**: 客戶端資料持久化
- **Drag and Drop API**: 拖曳互動

### 核心模組

1. **資料模組**
   - `CHANGES`: 10 個物理化學變化
   - `TEMP_Q`: 3 題溫度測驗
   - `TESTS`: 5 種酸鹼測試物質

2. **遊戲邏輯**
   - `checkSort`: 分類判斷
   - `updateTemp`: 溫度更新
   - `testSubstance`: 酸鹼測試

3. **狀態管理**
   - localStorage 讀寫
   - 星星計算與動畫
   - 進度追蹤

4. **視覺回饋**
   - 音效（beep）
   - 動畫（shake, pop, transition）
   - 顏色變化（燒杯、水銀柱）

### 設計模式

- **事件驅動**: drag/drop, click, input 事件
- **狀態模式**: 溫度範圍判斷（< 0, 0-100, > 100）
- **策略模式**: 分類檢查、星星計算邏輯
- **觀察者模式**: 溫度滑桿 input 事件監聽

### 響應式設計

- 基準寬度：390px (iPhone 12 mini)
- 最大寬度：1000px (桌面)
- 字體：clamp() 動態縮放
- 滑桿：100% 寬度適應

### 互動設計

- **雙操作模式**: 拖曳 + 點選（考慮觸控設備）
- **視覺提示**: 籃子高亮（dragover）
- **即時回饋**: 搖動動畫、音效、訊息
- **平滑過渡**: 0.5s transition（顏色、高度）

## 檔案結構

```
nature/matter-changes/
├── index.html          # 完整互動頁面（含 CSS 和 JS）
└── matter.md           # 本文檔（Mermaid 圖表）
```

## 複習系統整合

本課程已加入 `review/bank.js`:
- 單元代碼: `na3`
- 名稱: 第三單元 物質變變變
- 連結: `nature/matter-changes/`

**未來可擴展複習卡片**:
- `pick` 類型：判斷物理/化學變化
- `pick` 類型：溫度範圍選擇
- `pick` 類型：酸鹼性判斷

## 教學設計原則

✅ **課本內容優先**: 翰林版四上第三單元  
✅ **動手操作**: 拖曳、滑動、點選，0% 純文字  
✅ **立即回饋**: 視覺變化、動畫、音效、文字說明  
✅ **生活化例子**: 冰融化、木頭燒、肥皂水  
✅ **科學解釋**: 每個實驗都有原理說明  
✅ **自主探索**: 自由調整溫度、隨意測試物質  
✅ **成就感**: 星星獎勵、完成統計

## 科學內容說明

### 物理變化 vs 化學變化

| 物理變化 | 化學變化 |
|---------|---------|
| 外形改變，本質不變 | 產生新物質 |
| 可以恢復原狀 | 無法恢復原狀 |
| 例：冰融化、紙撕破 | 例：木頭燒、鐵生鏽 |

### 水的三態變化

- **固態（冰）**: 0°C 以下
- **液態（水）**: 0°C ~ 100°C
- **氣態（水蒸氣）**: 100°C 以上
- 三態之間可互相轉換（物理變化）

### 酸鹼指示劑

**紫高麗菜汁**是天然指示劑：
- **酸性（pH < 7）**: 變紅色（檸檬汁、醋）
- **中性（pH = 7）**: 保持紫色（清水）
- **鹼性（pH > 7）**: 變綠/黃色（小蘇打、肥皂）

## 資料來源與引用

- 翰林版自然四上第三單元課本
- 課本第1課：影響物質變化的因素
- 課本第2課：溫度對物質的影響
- 課本第3課：酸與鹼對物質的影響
