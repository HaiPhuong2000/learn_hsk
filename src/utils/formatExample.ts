// Parse example string into 3 parts: Chinese, Pinyin, Vietnamese
// Expected format: "Chinese text (Pinyin text) - Vietnamese text"
export const parseExample = (example: string | undefined): { chinese: string; pinyin: string; vietnamese: string } | null => {
  if (!example) return null;
  
  // Match pattern: "Chinese (Pinyin) - Vietnamese"
  const match = example.match(/^(.+?)\s*\((.+?)\)\s*-\s*(.+)$/);
  
  if (match) {
    return {
      chinese: match[1].trim(),
      pinyin: match[2].trim(),
      vietnamese: match[3].trim()
    };
  }
  
  // Fallback: if format doesn't match, return as-is
  return {
    chinese: example,
    pinyin: '',
    vietnamese: ''
  };
};
