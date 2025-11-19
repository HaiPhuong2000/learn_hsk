const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, 'src', 'data', 'vocabulary.ts');
const content = fs.readFileSync(vocabPath, 'utf8');

// Extract the array content
const match = content.match(/export const vocabularyData: VocabularyItem\[\] = (\[[\s\S]*\]);/);

if (!match) {
  console.error('Could not find vocabularyData array');
  process.exit(1);
}

// We need to parse this string into an object. 
// Since it's a TS file, it might have unquoted keys or trailing commas.
// Let's try to use eval (safe enough here as we own the file) or just regex if it's simple JSON-like.
// The file was generated with JSON.stringify-like format but with TS type annotation.
// Let's try to clean it up and JSON.parse it, or just use a safer approach:
// We will use a regex to find objects { ... } and parse them one by one or just use `eval` in a sandboxed way if possible, 
// but `eval` in node is just `eval`. 
// Let's assume the format is valid JS object literals.

let data;
try {
  // Remove the type annotation and export to make it valid JS for eval
  // We are just evaluating the array part
  data = eval(match[1]);
} catch (e) {
  console.error('Error parsing vocabulary data:', e);
  process.exit(1);
}

const levels = {};

data.forEach(item => {
  const level = item.level || 1;
  if (!levels[level]) {
    levels[level] = [];
  }
  levels[level].push(item);
});

// Write separate files
Object.keys(levels).forEach(level => {
  const levelData = levels[level];
  const fileContent = `import { VocabularyItem } from './vocabulary';

export const hsk${level}Data: VocabularyItem[] = ${JSON.stringify(levelData, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, 'src', 'data', `hsk${level}.ts`), fileContent);
  console.log(`Wrote src/data/hsk${level}.ts with ${levelData.length} items`);
});

console.log('Done splitting vocabulary.');
