const fs = require('fs');
const path = require('path');
const https = require('https');

const sheets = [
  { level: 1, gid: '2447338' },
  { level: 2, gid: '217318772' },
  { level: 3, gid: '1180352295' },
  { level: 4, gid: '463184394' },
  { level: 5, gid: '1832996066' },
  { level: 6, gid: '422682032' }
];

const baseUrl = 'https://docs.google.com/spreadsheets/d/1O-gLxbyKESLV1-QC73fLWQoTKPXyFKk5/export?format=csv&gid=';
const outputPath = path.join(__dirname, 'src/data/vocabulary.ts');

function downloadCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 307 || res.statusCode === 302) {
        downloadCSV(res.headers.location).then(resolve).catch(reject);
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function parseCSV(text, level) {
  const lines = text.split('\n');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = [];
    let currentVal = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    row.push(currentVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    result.push(row);
  }

  return result.map(row => {
    // Columns: STT, Từ mới, Phiên âm, Giải thích, Ví dụ (chữ hán), Phiên âm, Dịch
    const id = parseInt(row[0]);
    const character = row[1];
    const pinyin = row[2];
    const meaning = row[3];
    
    let example = '';
    if (row[4]) {
      example = `${row[4]} (${row[5]}) - ${row[6]}`;
    }

    if (!id || !character) return null;

    return {
      id: `${level}-${id}`, // Unique ID across levels
      character,
      pinyin,
      meaning,
      level,
      example: example || undefined
    };
  }).filter(item => item !== null);
}

async function main() {
  let allVocabulary = [];

  for (const sheet of sheets) {
    console.log(`Fetching HSK ${sheet.level}...`);
    try {
      const csvData = await downloadCSV(baseUrl + sheet.gid);
      const parsedData = parseCSV(csvData, sheet.level);
      console.log(`Fetched ${parsedData.length} words for HSK ${sheet.level}`);
      allVocabulary = allVocabulary.concat(parsedData);
    } catch (error) {
      console.error(`Error fetching HSK ${sheet.level}:`, error);
    }
  }

  const fileContent = `export interface VocabularyItem {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  level: number;
  example?: string;
}

export const vocabularyData: VocabularyItem[] = ${JSON.stringify(allVocabulary, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent);
  console.log(`Successfully wrote ${allVocabulary.length} items to ${outputPath}`);
}

main();
