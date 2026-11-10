# 今天的複習：題庫改進（bank.js）

本次更新日期：2026-11-10

## 改進概述

本次更新針對瑄瑄在學習中的弱點，新增了兩類複習卡片：

1. **國語形近字改錯**：新增氣/棄的混淆字卡 4 張
2. **英語時間表達**：新增 half past / quarter 句子排序 3 張
3. **數學角度單元**：新增 4 種新題型（量角器、角度分類、順逆時針、拖曳分類）

---

## 類別圖（Class Diagram）

```mermaid
classDiagram
    class REVIEW_BANK {
        +subjects: Object
        +units: Array
        +cards: Array
        +make(card): Question
        +GEN: Object
    }
    
    class Card {
        +id: string
        +s: string
        +u: string
        +type: string
        +label: string
        +gen?: string
        +later?: boolean
    }
    
    class Generator {
        +protractor(): Question
        +angleKind(): Question
        +clockDir(): Question
        +angleSort(): DragQuestion
    }
    
    class Question {
        +kind: string
        +q: string
        +opts?: Array
        +a?: number
        +ex: string
    }
    
    class DragQuestion {
        +kind: "drag"
        +mode: string
        +q: string
        +slots: Array
        +items: Array
        +need: number
        +ex: string
    }
    
    REVIEW_BANK *-- Card
    REVIEW_BANK *-- Generator
    Generator ..> Question
    Generator ..> DragQuestion
    Card ..> Generator
```

---

## 資料流程圖（Data Flow）

```mermaid
flowchart TD
    A[複習排程 srs.js] -->|選擇卡片| B[題庫 bank.js]
    B -->|讀取卡片資料| C{卡片類型?}
    
    C -->|type: spot| D[改錯字卡]
    C -->|type: order| E[排句子卡]
    C -->|type: drag| F[拖曳卡]
    C -->|gen: function| G[數學出題函式]
    
    D --> H[make 函式]
    E --> H
    F --> I[呼叫 GEN 函式]
    G --> I
    
    I --> J[產生題目 Question]
    H --> J
    
    J --> K[渲染到畫面]
    K --> L[學生作答]
    L --> M[評分與回饋]
    M -->|答錯| N[標記為小怪物]
    M -->|答對| O[更新盒子]
    
    N --> A
    O --> A
```

---

## 新增功能流程圖

### 1. 國語改錯字卡流程

```mermaid
flowchart LR
    A[LOOK 陣列] -->|課次,正確字,錯字,句子| B[產生改錯字卡]
    B --> C[替換成錯字]
    C --> D[split 成字元陣列]
    D --> E[標記錯誤位置]
    E --> F[type: spot 卡片]
    F --> G[學生點選錯字]
    G -->|正確| H[顯示正確寫法]
    G -->|錯誤| I[提示再看清楚]
```

新增 4 張氣/棄混淆字卡：
- 第 1 課：充滿藝術**氣**息（易錯：棄）
- 第 2 課：今天的天**氣**很好（易錯：汽）
- 第 3 課：有勇**氣**上臺表演（易錯：棄）
- 第 5 課：不輕言放**棄**（易錯：氣）

### 2. 英語排句子卡流程

```mermaid
flowchart LR
    A[EN_O 陣列] -->|課次,完整句子| B[產生排句子卡]
    B --> C[split 成單字陣列]
    C --> D[打亂順序]
    D --> E[type: order 卡片]
    E --> F[學生點選單字]
    F --> G[組成句子]
    G -->|正確順序| H[答對]
    G -->|錯誤順序| I[再試一次]
```

新增 3 張 half past / quarter 句子：
- It's **half past** four.（4:30）
- It's **a quarter past** six.（6:15）
- It's **a quarter to** seven.（6:45）

### 3. 數學角度題型流程

```mermaid
flowchart TD
    A[ma3 角度單元] --> B{選擇題型}
    
    B -->|protractor| C[量角器讀數]
    B -->|angleKind| D[角度分類]
    B -->|clockDir| E[順逆時針]
    B -->|angleSort| F[拖曳分類籃子]
    
    C --> C1[隨機內圈或外圈]
    C1 --> C2[產生角度 10°倍數]
    C2 --> C3[提供 3 個選項]
    C3 --> G[kind: pick]
    
    D --> D1[隨機選擇角度類型]
    D1 --> D2[產生對應度數]
    D2 --> D3[提供 5 個選項]
    D3 --> G
    
    E --> E1[隨機方向與起點]
    E1 --> E2[計算終點]
    E2 --> E3[提供 3 個選項]
    E3 --> G
    
    F --> F1[產生 4 個角度]
    F1 --> F2[建立 4 個籃子]
    F2 --> F3[kind: drag 拖曳卡]
    
    G --> H[學生作答]
    F3 --> H
```

---

## 拖曳卡架構圖

```mermaid
flowchart TD
    A[angleSort 函式] --> B[產生 4 個角度]
    B --> C{隨機選 3 種類型 + 重複 1 種}
    
    C --> D[銳角: 10°~85°]
    C --> E[直角: 90°]
    C --> F[鈍角: 95°~175°]
    C --> G[平角: 180°]
    
    D --> H[建立 items 陣列]
    E --> H
    F --> H
    G --> H
    
    H --> I[建立 slots 籃子]
    I --> I1[銳角籃子]
    I --> I2[直角籃子]
    I --> I3[鈍角籃子]
    I --> I4[平角籃子]
    
    I1 --> J[回傳 DragQuestion]
    I2 --> J
    I3 --> J
    I4 --> J
    
    J --> K[mode: baskets]
    K --> L[渲染到畫面]
    L --> M[學生拖曳]
    M -->|放對| N[計入 placed]
    M -->|放錯| O[計入 miss 並搖晃]
    N --> P{placed >= 4?}
    P -->|是| Q[完成]
    P -->|否| M
```

---

## ER 模型（Entity-Relationship）

```mermaid
erDiagram
    REVIEW_BANK ||--o{ CARD : contains
    REVIEW_BANK ||--|| GENERATOR : has
    CARD ||--o| UNIT : belongs_to
    CARD ||--|| SUBJECT : belongs_to
    CARD }o--|| QUESTION : generates
    GENERATOR ||--o{ QUESTION : creates
    
    REVIEW_BANK {
        object subjects
        array units
        array cards
        function make
    }
    
    CARD {
        string id PK
        string s "科目代碼"
        string u "單元代碼"
        string type "卡片類型"
        string label "卡片標籤"
        string gen "產生器名稱"
        boolean later "是否還沒教"
    }
    
    SUBJECT {
        string code PK
        string name
        string icon
        string color
    }
    
    UNIT {
        string k PK
        string s FK
        string name
        string href
        boolean later
    }
    
    QUESTION {
        string kind
        string q
        array opts
        number a
        string ex
    }
    
    GENERATOR {
        function protractor
        function angleKind
        function clockDir
        function angleSort
    }
```

---

## 使用案例圖（Use Case）

```mermaid
graph TB
    subgraph "複習系統"
        A[學生] --> B[作答題目]
        A --> C[拖曳分類]
        A --> D[點選改錯]
        
        B --> E[看量角器讀數]
        B --> F[選擇角度類型]
        B --> G[判斷旋轉方向]
        
        C --> H[拖角度到籃子]
        
        D --> I[找出錯字]
        
        J[系統] --> K[產生題目]
        J --> L[評分]
        J --> M[記錄進度]
        
        K --> B
        K --> C
        K --> D
        
        L --> N[更新盒子]
        L --> O[標記小怪物]
        
        M --> P[存到 localStorage]
    end
```

---

## 資料字典（Data Dictionary）

### 新增的 LOOK 條目

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| [0] | number | 課次 | 1, 2, 3, 5 |
| [1] | string | 正確的字 | "氣", "棄" |
| [2] | string | 形近字（錯字） | "棄", "氣", "汽" |
| [3] | string | 課文句子 | "充滿藝術氣息" |

### 新增的 EN_O 條目

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| [0] | number | 課次 | 2 |
| [1] | string | 完整句子 | "It's half past four." |

### 新增的數學卡片

| 單元 | 函式名 | 標籤 | 類型 |
|------|--------|------|------|
| ma3 | protractor | 量角器內外圈 | pick |
| ma3 | angleKind | 角度分類 | pick |
| ma3 | clockDir | 順時針與逆時針 | pick |
| ma3 | angleSort | 角度分類籃子 | drag |

---

## 統計資料

### 更新前後卡片數量對比

| 科目 | 更新前 | 更新後 | 新增 |
|------|--------|--------|------|
| 國語 | 142 | 146 | +4 |
| 數學 | 81 | 85 | +4 |
| 自然 | 63 | 63 | 0 |
| 社會 | 217 | 217 | 0 |
| 英語 | 72 | 75 | +3 |
| **總計** | **575** | **586** | **+11** |

### 卡片類型分布

```mermaid
pie title 卡片類型分布 (586 張)
    "國語 write/spot" : 146
    "數學 num/pick/drag" : 85
    "自然 pick/spot/drag" : 63
    "社會 pick" : 217
    "英語 spell/order/pick" : 75
```

---

## 實作細節

### 1. 量角器讀數 (protractor)

**產生邏輯**：
- 隨機選擇外圈或內圈（50% 機率）
- 產生 20°~170° 的角度（10° 的倍數）
- 外圈且 >= 100° 時，取補角（180 - d）
- 提供正確答案 + 2 個干擾選項

**驗證規則**：
- 答案範圍：20° ~ 170°（10° 倍數）
- 外圈：直接讀外圈數字
- 內圈：180 - 外圈數字

### 2. 角度分類 (angleKind)

**分類標準**（依康軒課本）：
- 銳角：5° ~ 85°（5° 倍數）
- 直角：90°
- 鈍角：95° ~ 175°（5° 倍數）
- 平角：180°
- 周角：360°

**產生邏輯**：
- 隨機選擇一種類型
- 產生對應範圍的角度
- 提供 5 個選項讓學生選擇

### 3. 順逆時針 (clockDir)

**產生邏輯**：
- 隨機起點（1~12）
- 隨機方向（順時針或逆時針）
- 隨機步數（2, 3, 4, 6 格）
- 計算終點位置

**驗證規則**：
- 順時針：照時鐘指針方向（from + steps）
- 逆時針：反時鐘方向（from - steps）
- 結果需 mod 12 處理循環

### 4. 角度分類籃子 (angleSort)

**產生邏輯**：
- 從 4 種類型中隨機選 3 種
- 再隨機重複其中 1 種，共 4 個角度
- 每種類型產生對應範圍的角度

**拖曳規則**：
- mode: 'baskets' 表示籃子模式
- 可以拖曳或點選
- 放錯會搖晃並提示
- 全部放對才完成

---

## 測試案例

### 量角器測試

```javascript
// 測試 10 次，確保：
// 1. 答案在 20°~170° 範圍
// 2. 都是 10° 的倍數
// 3. 有內外圈兩種情況
for (var i = 0; i < 10; i++) {
  var q = GEN.protractor();
  assert(q.kind === 'pick');
  assert(q.opts.length === 3);
  var ans = parseInt(q.opts[q.a]);
  assert(ans >= 20 && ans <= 170);
  assert(ans % 10 === 0);
}
```

### 角度分類測試

```javascript
// 測試 50 次，確保所有類型都有出現
var types = {};
for (var i = 0; i < 50; i++) {
  var q = GEN.angleKind();
  types[q.opts[q.a]] = true;
}
assert(types['銳角'] && types['直角'] && types['鈍角'] && types['平角'] && types['周角']);
```

### 拖曳卡測試

```javascript
// 測試 20 次，確保：
// 1. 產生 4 個角度
// 2. 角度與 slot 匹配正確
// 3. 包含至少 2 種不同類型
for (var i = 0; i < 20; i++) {
  var q = GEN.angleSort();
  assert(q.items.length === 4);
  assert(q.slots.length === 4);
  q.items.forEach(function(item) {
    var deg = item.deg;
    var slot = item.slot;
    if (deg < 90) assert(slot === '銳角');
    else if (deg === 90) assert(slot === '直角');
    else if (deg < 180) assert(slot === '鈍角');
    else if (deg === 180) assert(slot === '平角');
  });
}
```

---

## 課本對照

所有新增內容都嚴格對照課本：

### 國語（南一 4 上）

| 卡片 | 課次 | 課文出處 | 驗證 |
|------|------|----------|------|
| 氣/棄 | 第 1 課 | "充滿藝術氣息" | ✓ 課文第 3 段 |
| 氣/汽 | 第 2 課 | "今天的天氣很好" | ✓ 練習單形近字 |
| 氣/棄 | 第 3 課 | "有勇氣上臺表演" | ✓ 課文造句 |
| 棄/氣 | 第 5 課 | "不輕言放棄" | ✓ 課文第 2 段 |

### 英語（康軒 Wonder World 3）

| 卡片 | 單元 | 複習頁出處 | 驗證 |
|------|------|------------|------|
| half past | Unit 2 | review1/index.html line 230 | ✓ |
| quarter past | Unit 2 | review1/index.html line 231 | ✓ |
| quarter to | Unit 2 | review1/index.html line 232 | ✓ |

### 數學（康軒 4 上 第三單元）

| 題型 | 課本內容 | 驗證 |
|------|----------|------|
| 量角器內外圈 | 3-1 量角器的認識與報讀 | ✓ |
| 銳角/直角/鈍角/平角/周角 | 3-3 旋轉角 | ✓ |
| 順時針/逆時針 | 3-3 旋轉角 | ✓ |

---

## 待辦事項與已知限制

### ✅ 已完成
- [x] 國語：新增 4 張氣/棄混淆字卡
- [x] 英語：新增 3 張 half past/quarter 句子
- [x] 數學：新增量角器讀數題
- [x] 數學：新增角度分類題
- [x] 數學：新增順逆時針題
- [x] 數學：新增角度拖曳籃子
- [x] 更新卡片總數統計

### ⚠️ 無法驗證的項目
- 量角器題目中的「指針對準刻度」圖示（需要實際課本確認刻度標示方式）
- 所有新題型的實際難度是否適合四年級學生（需要實測）

### 💡 未來改進方向
- 可考慮為量角器題添加視覺化的量角器圖示
- 順逆時針題可以加上鐘面動畫
- 角度拖曳籃子可以加上即時視覺回饋（顯示角度圖形）

---

## 維護注意事項

### 不可變動的項目（硬約束）
1. ❌ **不可更改現有卡片 id**：會導致學生進度遺失
2. ❌ **不可修改 srs.js 排程規則**
3. ❌ **不可更改 localStorage 鍵名**（studyReviewV1、studyBackupAt）
4. ❌ **不可刪除或修改現有課文句子**（社會/自然的 pick 卡 id 由題目文字生成）

### 新增卡片檢查清單
- [ ] 確認課本有該內容（不可自創）
- [ ] 使用課本的正確用語（如：挺水性、浮葉性）
- [ ] 測試產生器 100+ 次確認無 NaN/undefined
- [ ] 檢查答案都在選項範圍內
- [ ] 更新 learning-design.md 的卡片總數
- [ ] 標註延伸內容為「🔎 延伸」而非「📖 課本」

---

**文檔版本**: 1.0  
**最後更新**: 2026-11-10  
**對應 commit**: 920b9ff
