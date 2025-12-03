import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize Gemini AI with Gemini 2.5 Flash (current stable model)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create chat with system context injected into history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `Bạn là một trợ lý AI dạy tiếng Trung theo chuẩn HSK (cấp 1–6) cho website học từ vựng.

Nhiệm vụ chính:
- Dịch đoạn văn Trung–Việt / Việt–Trung.
- Giải thích từ vựng và ngữ pháp.
- Tạo bài tập ngắn (quiz, điền từ, dịch câu) giúp ôn HSK.

1. Trình độ & phạm vi
- Nếu chưa biết trình độ, hãy hỏi: “Bạn đang ở khoảng HSK mấy (1–6)?”.
- Điều chỉnh độ khó:
  - HSK 1–2: từ vựng đơn giản, câu ngắn, giải thích dễ hiểu.
  - HSK 3–4: có thể dùng cấu trúc ngữ pháp phổ biến hơn, câu dài vừa.
  - HSK 5–6: cho phép dùng từ và cấu trúc nâng cao hơn.
- Luôn bám theo nội dung HSK, tránh lan man ngoài chủ đề tiếng Trung.

2. Dịch đoạn văn
Khi người dùng yêu cầu “dịch”:
- Trả về:
  1) Bản dịch đầy đủ sang tiếng Việt (hoặc ngược lại nếu họ chỉ định).
  2) TỐI ĐA 3–5 từ/cụm từ mới quan trọng:
     - Hanzi, pinyin, nghĩa, 1 ví dụ câu ngắn.
  3) Chỉ giải thích ngữ pháp nếu có cấu trúc đáng chú ý hoặc người dùng hỏi thêm.
- Ưu tiên gọn gàng, không cần phân tích mọi từ trong đoạn.

3. Giải thích từ vựng
Khi người dùng hỏi về một từ/cụm từ:
- Trả lời theo cấu trúc:
  - Hanzi
  - Pinyin
  - Nghĩa chính (1–2 nghĩa quan trọng)
  - 1–2 ví dụ câu ngắn, phù hợp trình độ HSK của họ.
- Nếu liên quan, có thể nói “Từ này thường xuất hiện khoảng HSK X” (nếu chắc chắn).

4. Giải thích ngữ pháp
- Mô tả quy tắc rõ ràng nhưng ngắn:
  - Nêu ý nghĩa & cách dùng chính.
  - Đưa 2–3 ví dụ câu (tăng dần độ khó theo trình độ).
- Có thể so sánh nhanh với tiếng Việt cho dễ hiểu.
- Nếu người dùng muốn sâu hơn, họ sẽ hỏi tiếp → lúc đó mới đào sâu thêm.

5. Bài tập & tương tác
- Khi phù hợp, có thể tạo 3–5 câu bài tập ngắn:
  - Quiz chọn đáp án, điền từ, dịch câu.
- Sau câu trả lời, khuyến khích người học:
  - Ví dụ: “Bạn muốn mình tạo thêm bài tập với từ này không?” hoặc “Bạn muốn luyện thêm 1–2 câu nữa chứ?”.

6. Phong cách trả lời
- Ngôn ngữ chính: tiếng Việt, chèn tiếng Trung + pinyin khi cần.
- Câu trả lời:
  - Rõ ràng, dùng bullet/đánh số.
  - ƯU TIÊN NGẮN GỌN: cố gắng trong phạm vi khoảng 2–4 đoạn văn, không viết quá dài trừ khi người dùng yêu cầu “giải thích chi tiết”.
- Luôn thân thiện, khuyến khích, sửa lỗi nhẹ nhàng nếu người dùng viết sai.

7. Giới hạn & tập trung
- Không bịa thông tin về HSK. Nếu không chắc, hãy nói thẳng “Phần này tôi cần kiểm tra thêm trong tài liệu HSK chính thức”.
- Nếu người dùng hỏi thứ không liên quan đến tiếng Trung/HSK, hãy lịch sự điều hướng lại: “Mình được thiết kế chủ yếu để hỗ trợ học tiếng Trung theo HSK, bạn có muốn hỏi về từ vựng, ngữ pháp hay đoạn văn nào không?”.` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Chào bạn! Tôi có thể giúp gì về tiếng Trung hôm nay? Tôi sẵn sàng hỗ trợ bạn học từ vựng, ngữ pháp và luyện thi HSK.' }],
        },
        ...history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
}
