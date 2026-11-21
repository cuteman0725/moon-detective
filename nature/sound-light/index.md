# 聲光世界真有趣 - 系統設計文件

翰林版自然 4上 第四單元（課本 p.98～123）

## 系統架構圖

```mermaid
graph TB
    subgraph "使用者介面層"
        A[index.html<br/>主頁面] --> B[開始頁]
        A --> C[4-1 聲音]
        A --> D[4-2 光]
        A --> E[4-3 應用]
        A --> F[挑戰頁]
    end
    
    subgraph "互動功能模組"
        C --> C1[聲音製造站<br/>點樂器看振動]
        C --> C2[傳播物質分類<br/>氣體/液體/固體]
        D --> D1[光的直線前進<br/>手電筒+鏡子演示]
        F --> F1[圖解筆記<br/>填空練習]
        F --> F2[找錯小偵探]
        F --> F3[大考驗混合題]
    end
    
    subgraph "資料儲存層"
        G[localStorage<br/>natureSoundLightV1]
        G --> G1[星星數]
        G --> G2[完成紀錄]
        G --> G3[答題統計]
        G --> G4[錯題記錄]
    end
    
    subgraph "題庫系統"
        H[review/bank.js]
        H --> H1[45 道選擇題<br/>na4:s1~s3]
        H --> H2[12 句找錯題]
        H --> H3[出題邏輯]
    end
    
    C1 --> G
    C2 --> G
    D1 --> G
    F1 --> G
    F2 --> G
    F3 --> G
    
    F2 --> H
    F3 --> H
    
    style A fill:#ffe6ef
    style G fill:#d8f3dc
    style H fill:#e6f0ff
```

## 資料流程圖

```mermaid
sequenceDiagram
    participant U as 使用者
    participant P as 頁面 JS
    participant LS as localStorage
    participant B as 題庫 bank.js
    
    U->>P: 開啟頁面
    P->>LS: 讀取 natureSoundLightV1
    LS-->>P: 回傳紀錄（或空物件）
    P->>P: renderScore() 顯示星星
    P->>P: renderStamps() 顯示集章卡
    
    U->>P: 點擊樂器
    P->>P: 播放振動動畫
    P->>LS: finish('sound', el)
    P->>LS: store.stars += 2
    P->>P: 更新顯示
    
    U->>P: 開始小測驗
    P->>B: 取得 na4:s1 卡片
    B-->>P: 回傳 5 張卡片
    P->>P: shuffle() 打亂順序
    
    loop 每一題
        P->>U: 顯示「我想好了」按鈕
        U->>P: 點擊看選項
        P->>P: shuffle(opts) 選項順序
        U->>P: 選擇答案
        alt 答對
            P->>LS: store.ok++, stars++
            P->>U: 顯示 ✅ 答對了
        else 答錯
            P->>LS: miss(sec, txt) 記錄錯題
            P->>U: 再選一次或看正確答案
        end
    end
    
    P->>LS: save() 儲存紀錄
    P->>P: renderRec() 更新統計
```

## 類別結構圖

```mermaid
classDiagram
    class Store {
        +number stars
        +number n
        +number ok
        +object best
        +object bad
        +array recent
        +object done
        +number guess
        +load()
        +save()
    }
    
    class Quiz {
        +array cards
        +number i
        +number ok
        +array res
        +object Q
        +start()
        +next()
        +choose(j)
        +end()
    }
    
    class Card {
        +string id
        +string s
        +string u
        +string type
        +string q
        +string a
        +array w
        +string ex
    }
    
    class Sorter {
        +array baskets
        +array items
        +number left
        +start()
        +check(item, basket)
        +finish()
    }
    
    class SpotGame {
        +array cards
        +number i
        +number ok
        +start()
        +next()
        +choose(j)
        +end()
    }
    
    Store "1" -- "1..*" Quiz : stores results
    Quiz "1" -- "5..10" Card : uses
    Store "1" -- "1" Sorter : tracks progress
    Store "1" -- "1" SpotGame : tracks progress
```

## 狀態機圖

```mermaid
stateDiagram-v2
    [*] --> 未完成
    
    未完成 --> 進行中 : 開始活動
    進行中 --> 答題中 : 開始測驗
    答題中 --> 答對 : 第一次就對
    答題中 --> 再試一次 : 答錯（多選項）
    再試一次 --> 答對 : 第二次對
    再試一次 --> 答錯 : 再次答錯
    答對 --> 下一題 : 繼續
    答錯 --> 下一題 : 看答案後繼續
    下一題 --> 答題中 : 還有題目
    下一題 --> 完成 : 全部做完
    
    進行中 --> 完成 : 完成互動
    完成 --> 已蓋章 : store.done[key]++
    已蓋章 --> [*]
    
    state 答題中 {
        [*] --> 想好
        想好 --> 看選項 : 點「我想好了」
        看選項 --> 選擇 : 點選項
        選擇 --> [*]
    }
```

## 活動流程圖

```mermaid
flowchart TD
    Start([開啟頁面]) --> Load[讀取 localStorage]
    Load --> ShowIntro[顯示開始頁<br/>先猜再學]
    
    ShowIntro --> Choose{選擇活動}
    
    Choose -->|4-1| Sound[聲音製造站]
    Choose -->|4-1| Medium[傳播物質分類]
    Choose -->|4-2| Light[光的直線前進]
    Choose -->|4-3| App[應用介紹]
    Choose -->|挑戰| Challenge[挑戰頁]
    
    Sound --> Click[點樂器]
    Click --> Vibrate[顯示振動波紋]
    Vibrate --> Check1{三個都試過?}
    Check1 -->|是| Star1[+2 星星, 蓋章]
    Check1 -->|否| Sound
    
    Medium --> Sort[籃子分類遊戲]
    Sort --> DragDrop[拖曳卡片到籃子]
    DragDrop --> Check2{全部放對?}
    Check2 -->|是| Star2[+2 星星, 蓋章]
    Check2 -->|否| Check3{放錯?}
    Check3 -->|是| Feedback[顯示提示]
    Feedback --> Sort
    
    Light --> Torch[打開手電筒按鈕]
    Torch --> Beam[光直線前進動畫]
    Beam --> Reflect[光反射動畫]
    Reflect --> Star3[+2 星星, 蓋章]
    
    Challenge --> Quiz[小測驗 5 題]
    Quiz --> Think[💭 我想好了]
    Think --> ShowOpts[顯示選項]
    ShowOpts --> Answer[選擇答案]
    Answer --> Correct{正確?}
    Correct -->|是| Star4[+1 星星]
    Correct -->|否| Tries{第一次?}
    Tries -->|是| Retry[再試一次]
    Tries -->|否| ShowAns[顯示正確答案]
    Retry --> ShowOpts
    ShowAns --> NextQ[下一題]
    Star4 --> NextQ
    NextQ --> Check4{做完?}
    Check4 -->|否| Think
    Check4 -->|是| AllCorrect{全對?}
    AllCorrect -->|是| Bonus[+3 星星]
    AllCorrect -->|否| Done1[完成]
    Bonus --> Done1
    
    Star1 --> UpdateMap[更新集章卡]
    Star2 --> UpdateMap
    Star3 --> UpdateMap
    Done1 --> UpdateMap
    UpdateMap --> Save[儲存 localStorage]
    Save --> End([結束])
```

## 複習卡片資料結構

```mermaid
erDiagram
    CARD {
        string id "na4:s1Vibrate"
        string s "科目 na"
        string u "單元 na4"
        string type "pick/spot"
        string q "題目文字"
        string a "正確答案"
        array w "錯誤選項"
        string ex "說明"
    }
    
    QUIZ_STATE {
        number i "目前題號"
        number ok "答對題數"
        array res "各題結果"
        number tries "嘗試次數"
        boolean lock "是否鎖定"
    }
    
    STORE {
        number stars "星星總數"
        number n "總答題數"
        number ok "第一次就對"
        object best "各測驗最佳"
        object bad "各節錯誤次數"
        array recent "最近錯題"
        object done "完成次數"
        number guess "猜測答案"
    }
    
    UNIT {
        string k "單元 key"
        string s "科目"
        string name "單元名稱"
        string href "連結路徑"
    }
    
    CARD ||--o{ QUIZ_STATE : "used in"
    QUIZ_STATE }o--|| STORE : "saves to"
    UNIT ||--o{ CARD : "contains"
```

## 使用案例圖

```mermaid
graph LR
    subgraph "四年級學生"
        U1[學生]
    end
    
    subgraph "家長"
        U2[爸媽]
    end
    
    subgraph "系統功能"
        UC1[點樂器看振動]
        UC2[分類聲音傳播]
        UC3[看光的直線前進]
        UC4[做小測驗]
        UC5[找錯小偵探]
        UC6[大考驗]
        UC7[填空練習]
        UC8[查看紀錄]
        UC9[清除紀錄]
        UC10[先猜再學]
    end
    
    U1 --> UC1
    U1 --> UC2
    U1 --> UC3
    U1 --> UC4
    U1 --> UC5
    U1 --> UC6
    U1 --> UC7
    U1 --> UC10
    
    U1 --> UC8
    U2 --> UC8
    U2 --> UC9
    
    UC4 -.includes.-> UC10
    UC5 -.includes.-> UC10
    UC6 -.includes.-> UC10
```

## 元件互動圖

```mermaid
graph TB
    subgraph "頁面結構"
        Header[Header<br/>標題+星星]
        Nav[Nav Tabs<br/>5個分頁]
        
        subgraph "Section Pages"
            P1[p-intro<br/>開始]
            P2[p-41<br/>4-1 聲音]
            P3[p-42<br/>4-2 光]
            P4[p-43<br/>4-3 應用]
            P5[p-game<br/>挑戰]
        end
    end
    
    subgraph "核心功能"
        F1[goTab<br/>切換分頁]
        F2[finish<br/>完成活動+星星]
        F3[star<br/>星星動畫]
        F4[renderStamps<br/>顯示集章卡]
        F5[save<br/>存localStorage]
    end
    
    subgraph "遊戲邏輯"
        G1[sorter<br/>籃子分類]
        G2[quiz<br/>小測驗]
        G3[spotGame<br/>找錯]
    end
    
    Nav --> F1
    F1 --> P1
    F1 --> P2
    F1 --> P3
    F1 --> P4
    F1 --> P5
    
    P2 --> G1
    P5 --> G2
    P5 --> G3
    
    G1 --> F2
    G2 --> F2
    G3 --> F2
    
    F2 --> F3
    F2 --> F4
    F2 --> F5
    
    F3 --> Header
    F4 --> P1
```

## 資料庫 ER Model（localStorage）

```mermaid
erDiagram
    natureSoundLightV1 ||--|| stars : contains
    natureSoundLightV1 ||--|| n : contains
    natureSoundLightV1 ||--|| ok : contains
    natureSoundLightV1 ||--o{ best : contains
    natureSoundLightV1 ||--o{ bad : contains
    natureSoundLightV1 ||--o{ recent : contains
    natureSoundLightV1 ||--o{ done : contains
    natureSoundLightV1 ||--|| guess : contains
    
    best {
        number q41 "4-1最佳"
        number q42 "4-2最佳"
        number q43 "4-3最佳"
        number spot "找錯最佳"
        number mix "大考驗最佳"
    }
    
    bad {
        number s1 "4-1錯誤次數"
        number s2 "4-2錯誤次數"
        number s3 "4-3錯誤次數"
    }
    
    recent {
        string p "題目文字"
        string k "所屬節次"
    }
    
    done {
        number sound "聲音製造站"
        number medium "傳播分類"
        number light "光的直線"
        number q41 "4-1測驗"
        number q42 "4-2測驗"
        number q43 "4-3測驗"
        number cloze "圖解筆記"
        number spot "找錯"
        number mix "大考驗"
    }
```

## 核心演算法流程

### 籃子分類遊戲演算法

```mermaid
flowchart TD
    Start([開始遊戲]) --> Init[初始化:<br/>left=items.length<br/>sel=null]
    Init --> Shuffle[打亂卡片順序]
    Shuffle --> Render[渲染卡片和籃子]
    
    Render --> Wait1{等待操作}
    Wait1 -->|點卡片| SelectCard[sel=i<br/>卡片標記.on]
    Wait1 -->|點籃子| CheckSel{sel !== null?}
    
    SelectCard --> Wait1
    
    CheckSel -->|否| ShowTip1[提示:<br/>先點卡片]
    ShowTip1 --> Wait1
    
    CheckSel -->|是| Match{items[sel][1]<br/>== k?}
    
    Match -->|是| Correct[移除卡片<br/>加到籃子<br/>left--]
    Match -->|否| Wrong[卡片和籃子<br/>shake 動畫]
    
    Correct --> CheckDone{left == 0?}
    CheckDone -->|否| Wait1
    CheckDone -->|是| Finish[顯示完成<br/>finish(key)]
    
    Wrong --> Wait1
    Finish --> End([結束遊戲])
```

### 小測驗答題邏輯

```mermaid
flowchart TD
    Start([開始測驗]) --> LoadCards[從 bank.js<br/>取得卡片]
    LoadCards --> Check{有題目?}
    Check -->|否| Error[顯示錯誤]
    Check -->|是| Init[S.i=0, S.ok=0]
    
    Init --> NextQ[next()]
    NextQ --> End1{i >= cards.length?}
    End1 -->|是| ShowResult[顯示結果<br/>全對+3星]
    
    End1 -->|否| PrepQ[準備第i題<br/>打亂選項<br/>S.tries=0]
    PrepQ --> ShowThink[顯示:<br/>💭我想好了]
    ShowThink --> Wait{等待點擊}
    Wait --> ShowOpts[顯示選項]
    ShowOpts --> WaitAns{等待選擇}
    
    WaitAns --> Choose[choose(j)]
    Choose --> Match{j == Q.a?}
    
    Match -->|是| First1{tries==0?}
    First1 -->|是| AddOk[store.ok++<br/>S.ok++<br/>+1星]
    First1 -->|否| NoStar[不加星]
    AddOk --> MarkGood[S.res[i]=1]
    NoStar --> MarkOk[S.res[i]=0]
    MarkGood --> ShowRight[顯示✅答對]
    MarkOk --> ShowRight
    
    Match -->|否| Inc[S.tries++<br/>miss(sec,txt)]
    Inc --> First2{tries==1<br/>且opts>2?}
    First2 -->|是| Retry[提示再試一次]
    First2 -->|否| ShowAns[顯示正確答案<br/>S.res[i]=0]
    
    Retry --> WaitAns
    ShowRight --> NextBtn[下一題按鈕]
    ShowAns --> NextBtn
    NextBtn --> IncI[S.i++]
    IncI --> NextQ
    
    ShowResult --> FinishQuiz[finish(key)]
    FinishQuiz --> End([結束測驗])
    Error --> End
```

## 星星獎勵機制

| 動作 | 星星數 | 觸發條件 |
|------|--------|----------|
| 完成互動活動 | +2 | finish(key) 首次完成 |
| 小測驗答對一題 | +1 | 第一次就選對 |
| 小測驗全對 | +3 | bonus 獎勵 |
| 找錯答對一句 | +1 | 第一次就找對 |
| 大考驗全對 | +3 | bonus 獎勵 |

## 技術規格

### 前端技術
- 純 HTML + CSS + JavaScript（Vanilla JS，無框架）
- localStorage 儲存紀錄
- CSS 動畫（振動、波紋、星星爆炸）
- RWD 設計（最小支援 390px 寬度）
- 無障礙屬性（aria-label）

### 瀏覽器支援
- localStorage API
- CSS Grid / Flexbox
- ES5+ JavaScript
- SVG 動畫

### 效能考量
- 圖片使用 Emoji（無需載入外部圖檔）
- localStorage 容量限制（約 5MB）
- 動畫使用 CSS transform（硬體加速）
- 題目即時產生（不預先載入全部）

## 相依性

### 外部相依
- `../../review/bank.js` - 題庫系統
- `../` - 返回自然首頁
- `../quest/` - 闖關地圖（尚未整合）
- `../../review/` - 今天的複習

### 內部模組相依
- 互動活動 → localStorage
- 小測驗 → bank.js + localStorage
- 集章系統 → 所有活動 + localStorage
- 星星系統 → finish() + star()

## 未來擴充方向

1. **整合闖關地圖**
   - 將第四單元加入 nature/quest/
   - 需重新設計地圖佈局（目前只有前兩單元）

2. **增加互動性**
   - 聲音播放功能（實際樂器聲）
   - 光的反射可調整角度
   - 更多動物聲音的互動

3. **記錄擴充**
   - 每題答題時間紀錄
   - 學習曲線圖表
   - 匯出學習報告

4. **題目擴充**
   - 科學閱讀「萬花筒」的互動實作
   - 更多找錯題
   - 開放式問答題
