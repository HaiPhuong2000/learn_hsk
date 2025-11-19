export interface GrammarPoint {
  id: number;
  title: string;
  structure: string;
  explanation: string;
  examples: {
    chinese: string;
    pinyin: string;
    meaning: string;
  }[];
  level: number;
}

export const grammarData: GrammarPoint[] = [
  {
    id: 1,
    title: 'Dùng "shi" để là',
    structure: 'Chủ ngữ + 是 + Danh từ',
    explanation: 'Động từ 是 (shì) được dùng để nối chủ ngữ với tân ngữ, tương đương với "là" trong tiếng Việt. Lưu ý rằng nó thường KHÔNG được dùng để nối tính từ với chủ ngữ.',
    examples: [
      { chinese: '我是学生。', pinyin: 'Wǒ shì xuésheng.', meaning: 'Tôi là học sinh.' },
      { chinese: '他是老师。', pinyin: 'Tā shì lǎoshī.', meaning: 'Anh ấy là giáo viên.' },
      { chinese: '这是书。', pinyin: 'Zhè shì shū.', meaning: 'Đây là sách.' }
    ],
    level: 1
  },
  {
    id: 2,
    title: 'Câu hỏi đơn giản với "ma"',
    structure: 'Câu trần thuật + 吗 ?',
    explanation: 'Thêm 吗 (ma) vào cuối câu trần thuật để biến nó thành câu hỏi Có/Không.',
    examples: [
      { chinese: '你是中国人吗？', pinyin: 'Nǐ shì Zhōngguórén ma?', meaning: 'Bạn là người Trung Quốc phải không?' },
      { chinese: '你好吗？', pinyin: 'Nǐ hǎo ma?', meaning: 'Bạn khỏe không?' },
      { chinese: '他吃肉吗？', pinyin: 'Tā chī ròu ma?', meaning: 'Anh ấy có ăn thịt không?' }
    ],
    level: 1
  },
  {
    id: 3,
    title: 'Sở hữu cách với "de"',
    structure: 'Người sở hữu + 的 + Vật bị sở hữu',
    explanation: 'Trợ từ 的 (de) chỉ sự sở hữu, tương đương với "của" trong tiếng Việt.',
    examples: [
      { chinese: '我的书', pinyin: 'wǒ de shū', meaning: 'Sách của tôi' },
      { chinese: '老师的名字', pinyin: 'lǎoshī de míngzi', meaning: 'Tên của giáo viên' },
      { chinese: '爸爸的车', pinyin: 'bàba de chē', meaning: 'Xe của bố' }
    ],
    level: 1
  },
  {
    id: 4,
    title: 'Phủ định với "bu"',
    structure: 'Chủ ngữ + 不 + Động từ/Tính từ',
    explanation: '不 (bù) được dùng để phủ định động từ và tính từ ở hiện tại và tương lai. Lưu ý với động từ 有 (yǒu - có), phải dùng 没 (méi) thay vì 不.',
    examples: [
      { chinese: '我不吃牛肉。', pinyin: 'Wǒ bù chī niúròu.', meaning: 'Tôi không ăn thịt bò.' },
      { chinese: '他不是学生。', pinyin: 'Tā bú shì xuésheng.', meaning: 'Anh ấy không phải là học sinh.' },
      { chinese: '我不高兴。', pinyin: 'Wǒ bù gāoxìng.', meaning: 'Tôi không vui.' }
    ],
    level: 1
  }
];
