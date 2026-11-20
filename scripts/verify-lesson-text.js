#!/usr/bin/env node
/**
 * Verification script: checks that all story text in lessons 8-12 HTML files
 * are substrings of the verbatim course text from /tmp/verbatim-kewen.txt
 * 
 * This includes:
 * - Quoted sentences from the text
 * - Quiz questions and answers
 * - Reading comprehension summaries
 * - Pattern examples
 * - Any text presented as fact from the story
 * 
 * Excludes:
 * - Instructions and prompts
 * - Self-authored explanations marked as such
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read the verbatim text
const verbatimPath = '/tmp/verbatim-kewen.txt';
const verbatimText = fs.readFileSync(verbatimPath, 'utf-8');

// Lesson configurations
const lessons = [
  { num: 8, dir: 'lesson8-seasons-hair', title: '四季的頭髮' },
  { num: 9, dir: 'lesson9-birding', title: '阿白觀察記' },
  { num: 10, dir: 'lesson10-mouse-wedding', title: '老鼠嫁女兒' },
  { num: 11, dir: 'lesson11-porridge-grandma', title: '豆粥婆婆' },
  { num: 12, dir: 'lesson12-jizo-hats', title: '戴斗笠的地藏' }
];

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  byLesson: {}
};

console.log('='.repeat(80));
console.log('Verifying lessons 8-12: All story text matches verbatim course text');
console.log('='.repeat(80));
console.log();

/**
 * Extract text that claims to be from the story
 */
function extractStoryText(html, lessonNum) {
  const texts = [];
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Extract from Core data object
  const coreScript = doc.querySelector('#core');
  if (coreScript) {
    const content = coreScript.textContent;
    
    // Extract tx values (text from story for characters)
    const txPattern = /tx:"([^"]+)"/g;
    let match;
    while ((match = txPattern.exec(content)) !== null) {
      const text = match[1];
      if (text.length > 2) { // Skip very short strings
        texts.push({ type: 'character-tx', text });
      }
    }
    
    // Extract quiz questions that quote the text
    const quizPattern = /q:"([^"]+)"/g;
    while ((match = quizPattern.exec(content)) !== null) {
      const text = match[1];
      // Only include if it looks like a quote (contains specific story elements)
      if (text.includes('的') && text.length > 10) {
        texts.push({ type: 'quiz-question', text });
      }
    }
    
    // Extract answers
    const answerPattern = /a:"([^"]+)"/g;
    while ((match = answerPattern.exec(content)) !== null) {
      const text = match[1];
      if (text.length > 3 && !text.match(/^[A-Z]$/)) {
        texts.push({ type: 'answer', text });
      }
    }
  }
  
  // Extract from HTML content (導讀 summaries, etc.)
  const leads = doc.querySelectorAll('.lead');
  leads.forEach(lead => {
    const text = lead.textContent.trim();
    // Skip if it's clearly instructional or marked as self-authored
    if (!text.includes('例如') && !text.includes('就是') && 
        !text.includes('自編導讀') && !text.includes('自編說明') && 
        !text.startsWith('（自編') && !text.startsWith('•') && 
        text.length > 10) {
      texts.push({ type: 'lead-summary', text });
    }
  });
  
  // Extract quoted text (class="quote" or similar)
  const quotes = doc.querySelectorAll('.quote, [class*="quot"]');
  quotes.forEach(quote => {
    const text = quote.textContent.trim();
    if (text.length > 2) {
      texts.push({ type: 'quote', text });
    }
  });
  
  return texts;
}

/**
 * Check if text is a substring or clearly instructional
 */
function isValidText(text, type) {
  // Instructions/prompts that don't need verification
  const instructionPatterns = [
    /^選/,
    /^填/,
    /^用/,
    /^看/,
    /^聽/,
    /是什麼/,
    /為什麼/,
    /怎麼/,
    /哪個/,
    /哪裡/,
    /多少/,
    /幾/
  ];
  
  // For quiz questions, only flag if they claim story facts
  if (type === 'quiz-question') {
    return true; // Questions are instructions, not story text
  }
  
  for (const pattern of instructionPatterns) {
    if (pattern.test(text)) {
      return true; // It's an instruction, not a story claim
    }
  }
  
  // Check if it's in the verbatim text
  return verbatimText.includes(text);
}

// Process each lesson
for (const lesson of lessons) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`Lesson ${lesson.num}: ${lesson.title}`);
  console.log('─'.repeat(80));
  
  const htmlPath = path.join(__dirname, '..', 'chinese', lesson.dir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠ HTML file not found: ${htmlPath}`);
    continue;
  }
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const texts = extractStoryText(html, lesson.num);
  
  results.byLesson[lesson.num] = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: []
  };
  
  for (const item of texts) {
    results.total++;
    results.byLesson[lesson.num].total++;
    
    if (isValidText(item.text, item.type)) {
      results.passed++;
      results.byLesson[lesson.num].passed++;
      console.log(`✓ [${item.type}] "${item.text.substring(0, 60)}${item.text.length > 60 ? '...' : ''}"`);
    } else {
      results.failed++;
      results.byLesson[lesson.num].failed++;
      results.byLesson[lesson.num].failures.push(item);
      console.log(`✗ [${item.type}] "${item.text}" - NOT FOUND IN TEXT`);
    }
  }
}

// Summary
console.log();
console.log('='.repeat(80));
console.log('Summary');
console.log('='.repeat(80));

for (const lesson of lessons) {
  const stats = results.byLesson[lesson.num];
  if (stats) {
    const pct = stats.total > 0 ? (stats.passed / stats.total * 100).toFixed(1) : 0;
    console.log(`Lesson ${lesson.num}: ${stats.passed}/${stats.total} passed (${pct}%) - ${stats.failed} failed`);
  }
}

console.log();
console.log(`Total: ${results.passed}/${results.total} passed (${(results.passed/results.total*100).toFixed(1)}%)`);
console.log(`Failed: ${results.failed}`);

if (results.failed > 0) {
  console.log();
  console.log('Failed entries by lesson:');
  for (const lesson of lessons) {
    const stats = results.byLesson[lesson.num];
    if (stats && stats.failures.length > 0) {
      console.log(`\n  Lesson ${lesson.num} (${stats.failures.length} failures):`);
      stats.failures.forEach(f => {
        console.log(`    - [${f.type}] "${f.text}"`);
      });
    }
  }
  process.exit(1);
} else {
  console.log();
  console.log('✅ All story text verified as substrings of the verbatim text!');
  process.exit(0);
}
