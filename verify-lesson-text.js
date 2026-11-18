#!/usr/bin/env node
/**
 * Verification script: checks that all tx values in bank.js for lessons 8-12
 * are substrings of the verbatim course text from /tmp/verbatim-kewen.txt
 */

const fs = require('fs');
const path = require('path');

// Read the verbatim text
const verbatimPath = '/tmp/verbatim-kewen.txt';
const verbatimText = fs.readFileSync(verbatimPath, 'utf-8');

// Read bank.js and extract the character data
const bankPath = path.join(__dirname, 'review', 'bank.js');
const bankContent = fs.readFileSync(bankPath, 'utf-8');

// Extract character entries for lessons 8-12
const charPattern = /"l":(8|9|10|11|12),"c":"([^"]+)"[^}]*"tx":"([^"]+)"/g;
let match;
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

console.log('='.repeat(70));
console.log('Verifying lesson 8-12 character tx values against verbatim text');
console.log('='.repeat(70));
console.log();

while ((match = charPattern.exec(bankContent)) !== null) {
  const lesson = match[1];
  const char = match[2];
  const tx = match[3];
  
  results.total++;
  
  // Check if tx is a substring of the verbatim text
  if (verbatimText.includes(tx)) {
    results.passed++;
    console.log(`✓ L${lesson} [${char}]: "${tx}"`);
  } else {
    results.failed++;
    results.failures.push({ lesson, char, tx });
    console.log(`✗ L${lesson} [${char}]: "${tx}" - NOT FOUND IN TEXT`);
  }
}

console.log();
console.log('='.repeat(70));
console.log('Summary');
console.log('='.repeat(70));
console.log(`Total characters checked: ${results.total}`);
console.log(`Passed: ${results.passed} (${(results.passed/results.total*100).toFixed(1)}%)`);
console.log(`Failed: ${results.failed} (${(results.failed/results.total*100).toFixed(1)}%)`);

if (results.failed > 0) {
  console.log();
  console.log('Failed entries:');
  results.failures.forEach(f => {
    console.log(`  - Lesson ${f.lesson}, 字: ${f.char}, tx: "${f.tx}"`);
  });
  process.exit(1);
} else {
  console.log();
  console.log('✅ All tx values are verified as substrings of the verbatim text!');
  process.exit(0);
}
