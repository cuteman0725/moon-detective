# Lessons 8-12 Verification Report

## Executive Summary

**Current Status**: 104/163 items verified (63.8%)
- ✅ **Lesson 8**: 100% complete (36/36)
- ⚠️ **Lesson 9**: 51.4% (19/37) - needs 18 fixes
- ⚠️ **Lesson 10**: 55.2% (16/29) - needs 13 fixes
- ⚠️ **Lesson 11**: 56.7% (17/30) - needs 13 fixes
- ⚠️ **Lesson 12**: 51.6% (16/31) - needs 15 fixes

**Total remaining failures**: 59 items across lessons 9-12

## Verification Tool

Created `scripts/verify-lesson-text.js` to automatically check that all story text in lessons 8-12 matches the verbatim course text from `/tmp/verbatim-kewen.txt`.

**What it checks**:
- Quoted sentences from the text
- Quiz questions and answers
- Reading comprehension summaries (導讀)
- Pattern examples
- Any text presented as fact from the story

**What it excludes**:
- Instructions and prompts
- Self-authored explanations marked as (自編導讀) or (自編說明)
- Bullet points starting with "•"

**Usage**:
```bash
cd /agent/repos/moon-detective
node scripts/verify-lesson-text.js
```

## Lesson 8: 四季的頭髮 ✅ COMPLETE

### Major Changes Made

#### 1. Poem Structure Fixed
**Old order**: Spring → Summer → Autumn → Winter  
**New order**: Summer → Autumn → Winter → Spring  
**Reason**: This is the actual order in the verbatim text

#### 2. Season Content Corrections

| Season | ❌ Old (Deleted) | ✅ New (From Poem) |
|--------|-----------------|-------------------|
| **Summer** | 樹葉茂密 (Dense leaves)<br>知了在辨認 (Cicada identifying) | 西北雨 (Northwest rain)<br>南風吹來 (South wind)<br>又急又長,響聲陣陣 |
| **Autumn** | 樹葉變金黃 (Leaves turn gold)<br>在理髮板凳上染頭髮 (Dye hair at barber)<br>火旺旺的顏色 (Fiery color) | 滿山的芒草 (Mountain grass)<br>西風吹來 (West wind)<br>乘著風搖,學著雲舞 |
| **Winter** | 樹葉掉光 (Leaves fall off)<br>理了大光頭 (Got a bald head)<br>風乘著雪橇離開 (Wind rides sled away) | 山頂上的白雪 (Snow on mountain)<br>北風吹來 (North wind)<br>冰涼涼、冷絲絲<br>最愛滑雪板梳辮子 |
| **Spring** | 樹葉/草蓬龐 (Lush leaves/grass)<br>春風吹散 (Spring wind scatters) | 冒出來的小青草 (Little green grass)<br>東風吹來 (East wind)<br>踮起腳尖,挺起腰<br>一散千里 |

#### 3. Deleted Content Summary

All references to the following were removed as they don't appear in the actual poem:
- ❌ 樹葉 (tree leaves) - appeared 8+ times, now 0
- ❌ 知了 (cicada) - was in Summer section
- ❌ 染髮 / 染過頭髮 (dye/dyed hair) - was in Autumn section
- ❌ 板凳 (bench/stool) - was in Autumn section
- ❌ 大光頭 (bald head) - was in Winter section
- ❌ 雪橇 (sled) - was in Winter section
- ❌ 赫赫的金黃 (brilliant gold) - color description not in poem
- ❌ 火旺旺 (fiery) - color description not in poem
- ❌ 風踏著腳步走了 (wind walked away) - not in poem
- ❌ 蓬龐 (lush/fluffy) - not in actual poem

#### 4. Vocabulary Updated

**Old vocabulary (deleted)**:
- 挺直, 蓬龐, 吹散, 絲絲 (as single word)
- 千里, 板凳, 赫赫, 辨認
- 火旺旺, 舞蹈

**New vocabulary (from poem)**:
- 西北雨, 陣陣, 披下來, 眼眶
- 芒草, 乘著, 臉龐
- 冷絲絲, 辮子, 踮起腳尖, 挺起腰, 一散千里

#### 5. Sentence Pattern Updated

**Old**: Various scattered patterns  
**New**: **Repetitive structure** from poem: "X天的頭髮在哪裡？X風吹來，找哇找……"

This is the actual pattern used in all 4 stanzas of the poem.

#### 6. Quiz Questions Rewritten

All 11 reading comprehension questions now reference:
- The actual 4 things that are "hair": 西北雨, 芒草, 白雪, 小青草
- The actual 4 winds: 南風, 西風, 北風, 東風
- Actual quoted phrases from the poem

#### 7. Season Classification Fixed

The 季節分類 challenge now uses 16 authentic phrases from the poem:
- 4 summer phrases (e.g., "南風吹來,找哇找", "又急又長,響聲陣陣")
- 4 autumn phrases (e.g., "秋天的頭髮是滿山的芒草", "乘著風搖,學著雲舞")
- 4 winter phrases (e.g., "冰涼涼、冷絲絲", "最愛滑雪板來幫它梳出一條一條長辮子")
- 4 spring phrases (e.g., "踮起腳尖,挺起腰", "一散千里")

#### 8. Marking Self-Authored Content

All導讀 sections now clearly marked as (自編導讀) to indicate they are paraphrases, not direct quotes.

All explanatory examples marked as (自編說明).

### Verification Result: 36/36 ✅

All text in Lesson 8 is now either:
1. Direct verbatim quotes from the poem, or
2. Clearly marked as self-authored explanations

---

## Remaining Issues: Lessons 9-12

### Lesson 9: 阿白觀察記 (19/37 verified, 18 failures)

**Story Summary**: Observational essay about a white-headed bulbul bird (白頭翁) named 阿白 who visits the balcony to sing, mate, build a nest, and raise chicks.

**Failed Items** (content not in verbatim text):

#### Quiz Answers to Delete/Fix:
1. ❌ "繞來繞去" (go around in circles)
2. ❌ "一隻鳥(白頭翁)" - should be just "白頭翁"
3. ❌ "灰色上衣、灰綠色夾克" - verbatim says "灰色上衣,灰綠色夾克" (comma, not pause-comma)
4. ❌ "溫暖的窩" (warm nest) - not in story
5. ❌ "碎碎的聲音" (crunching sounds) - not in story
6. ❌ "把盒子拆開" (open boxes) - not in story
7. ❌ "很豐富多變" (very varied) - not in story
8. ❌ "都喜歡安靜" (both like quiet) - not in story
9. ❌ "好朋友、好偶伴" (good friend, good companion) - not in story
10. ❌ "褐色和白色相間" (brown and white) - not in story
11. ❌ "毛茸茸的圍巾" (fluffy scarf) - not in story
12. ❌ "牌盒和塑膠袋" (card boxes and plastic bags) - not in story

**Root Cause**: Lessons 9 appears to have quiz content mixed from a different story (possibly about a pet, not a wild bird). These items describe pet behaviors (playing with boxes, eating food that crunches) not bird behaviors.

#### Lead Summaries to Rewrite:
4 導讀 sections need to be rewritten to use more quoted text and less paraphrase, or marked as (自編導讀).

---

### Lesson 10: 老鼠嫁女兒 (16/29 verified, 13 failures)

**Story Summary**: Folk tale about mouse parents seeking the strongest husband for their daughter, asking Sun → Cloud → Wind → Wall, ultimately realizing mouse is strongest.

**Failed Items**:

#### Quiz Answers to Delete/Fix:
1. ❌ "丟來丟去" (toss around) - not in verbatim text
2. ❌ "最強大的對象" (most powerful one) - not exact phrase
3. ❌ "風可以把雲吹來吹去" (wind blows cloud around) - paraphrase
4. ❌ "風吹不動牆" (wind can't blow wall) - paraphrase
5. ❌ "老鼠會在牆上咬洞" (mouse bites holes in wall) - paraphrase
6. ❌ "另一隻老鼠" (another mouse) - not exact phrase
7. ❌ "適合自己的才是最好的" (what suits you is best) - moral not in text

#### Lead Summaries to Rewrite:
6 導讀 sections are paraphrases that should either be closer to verbatim text or marked as (自編導讀).

**Pattern**: These are reasonable paraphrases but need to use more quoted phrases or be marked as summaries.

---

### Lesson 11: 豆粥婆婆 (17/30 verified, 13 failures)

**Story Summary**: Korean folk tale about a kind grandmother who makes red bean porridge, almost eaten by a tiger, saved by items that fight the tiger.

**Failed Items**:

#### Quiz Answers to Delete/Fix:
1. ❌ "飢餓的小鳥" (hungry bird) - not in story
2. ❌ "木柄掉進鍋子裡" (wooden handle falls in pot) - not in story
3. ❌ "淹沒了村莊" (flooded village) - not in story
4. ❌ "善良會得到回報" (kindness is rewarded) - moral not in text
5. ❌ "媽媽每天用電鍋煮飯" (mom cooks with rice cooker) - different story
6. ❌ "弟弟因為生病請假" (brother took sick leave) - different story
7-8. More wrong story examples

**Root Cause**: Like Lesson 9, quiz content appears mixed from wrong stories.

#### Lead Summaries to Rewrite:
5 導讀 sections need revision.

---

### Lesson 12: 戴斗笠的地藏 (16/31 verified, 15 failures)

**Story Summary**: Japanese folk tale about poor old couple, grandfather gives straw hats to 6 Jizo statues, Jizo repay with food for New Year.

**Failed Items**:

#### Quiz Answers to Delete/Fix:
1. ❌ "山腳下的小村莊" (village at mountain foot) - paraphrase
2. ❌ "一頂也沒賣掉" (didn't sell any) - paraphrase
3. ❌ "六尊地藏菩薩" (6 Jizo bodhisattvas) - verbatim says "六座...地藏菩薩石像"
4. ❌ "五頂斗笠和自己的頭巾" - paraphrase
5. ❌ "米、年糕和各種年貨" - paraphrase
6. ❌ "善良會得到祝福" (kindness gets blessings) - moral not in text
7-10. More pattern examples from wrong context

#### Lead Summaries to Rewrite:
5 導讀 sections need revision.

---

## Recommendations for Completing Lessons 9-12

### Priority 1: Remove Wrong-Story Content
- **Lesson 9**: Remove all pet-behavior questions (boxes, warm nest, crunching food sounds)
- **Lesson 11**: Remove bird/wooden handle/flooding content
- **Lesson 12**: Remove pattern sentences about different contexts

### Priority 2: Fix Paraphrases
For each remaining failure:
1. Check if it can be rewritten using quoted phrases from verbatim text
2. If not, mark it clearly as (自編導讀) or (自編說明)
3. If it's a quiz answer that's a paraphrase, either:
   - Use the exact phrase from text, or
   - Don't test on that specific detail

### Priority 3: Verification Loop
After each fix:
```bash
node scripts/verify-lesson-text.js
```

Goal: 100% verification for all lessons 8-12 (163/163 items)

---

## Appendix: Verbatim Text Structure

### Lesson 8 Poem Structure:
```
第八課 四季的頭髮(林世仁)
夏天的頭髮在哪裡?南風吹來,找哇找……啊——夏天的頭髮是西北雨!
秋天的頭髮在哪裡?西風吹來,找哇找……啊——秋天的頭髮是滿山的芒草!
冬天的頭髮在哪裡?北風吹來,找哇找……啊——冬天的頭髮是山頂上的白雪!
春天的頭髮在哪裡?東風吹來,找哇找……啊——春天的頭髮是冒出來的小青草!
```

Each stanza has the same structure:
1. X天的頭髮在哪裡？
2. X風吹來，找哇找……
3. 啊——X天的頭髮是[actual thing]!
4. [Description of that thing with personification]

This repetitive pattern is the key teaching point for Lesson 8.

---

**Report Generated**: 2026-11-18  
**Verification Script**: `scripts/verify-lesson-text.js`  
**Status**: Lesson 8 complete, Lessons 9-12 need fixes
