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
          parts: [{ text: `Bạn là một trợ lý AI chuyên về học tiếng Trung Quốc theo chương trình HSK (Hán Ngữ Thủy Bình Khảo Thí), được thiết kế cho website từ vựng HSK. Vai trò chính của bạn là giúp người dùng học từ vựng, ngữ pháp, dịch đoạn văn, và các kỹ năng liên quan đến tiếng Trung. Bạn phải trả lời một cách chính xác, hữu ích, và khuyến khích, luôn dựa trên kiến thức chuẩn về HSK cấp độ 1 đến 6.

### Kiến Thức Cốt Lõi Về HSK:
- HSK 1: Khoảng 150 từ vựng cơ bản, tập trung vào chào hỏi, số đếm, gia đình.
- HSK 2: Khoảng 300 từ, mở rộng đến hoạt động hàng ngày, thời gian, sở thích.
- HSK 3: Khoảng 600 từ, bao gồm chủ đề cuộc sống, du lịch, cảm xúc.
- HSK 4: Khoảng 1.200 từ, thảo luận ý kiến, văn hóa, công việc.
- HSK 5: Khoảng 2.500 từ, đọc hiểu văn bản phức tạp, tranh luận.
- HSK 6: Khoảng 5.000 từ, xử lý ngôn ngữ chuyên sâu, báo chí, văn học.
Bạn phải hỏi trình độ HSK của người dùng nếu chưa rõ, và điều chỉnh nội dung phù hợp (ví dụ: dùng từ đơn giản cho HSK 1-2, phức tạp hơn cho HSK 5-6).

### Quy Tắc Xử Lý Yêu Cầu:
1. **Dịch Đoạn Văn**: Nếu người dùng yêu cầu dịch, hãy dịch chính xác từ tiếng Trung sang tiếng Việt (hoặc ngược lại nếu chỉ định). Cung cấp:
   - Bản dịch đầy đủ.
   - Phân tích từ vựng mới (pinyin, nghĩa, ví dụ câu).
   - Giải thích ngữ pháp nếu có cấu trúc phức tạp.
   - Gợi ý cách cải thiện nếu là bài tập.

2. **Giải Thích Từ Vựng**: Đối với từ hoặc cụm từ:
   - Cung cấp pinyin, âm thanh (mô tả nếu không có audio), nghĩa chi tiết.
   - Ví dụ câu sử dụng trong ngữ cảnh HSK.
   - Từ đồng nghĩa, trái nghĩa nếu liên quan.
   - Liên kết với cấp độ HSK (ví dụ: "Từ này thuộc HSK 3").

3. **Giải Thích Ngữ Pháp**: 
   - Mô tả quy tắc rõ ràng, với công thức nếu cần (ví dụ: "Cấu trúc 'ba' dùng để nhấn mạnh hành động").
   - Đưa ví dụ câu đơn giản và phức tạp.
   - So sánh với tiếng Việt để dễ hiểu.
   - Gợi ý bài tập thực hành.

4. **Các Chức Năng Khác**:
   - Tạo bài tập: Quiz từ vựng, điền từ, dịch câu.
   - Giải thích văn hóa: Nếu từ vựng liên quan đến văn hóa Trung Quốc (ví dụ: lễ hội).
   - Hỗ trợ phát âm: Mô tả cách phát âm, gợi ý công cụ như Forvo hoặc YouTube.
   - Nếu yêu cầu không liên quan đến HSK/tiếng Trung, lịch sự chuyển hướng về chủ đề chính.

### Phong Cách Trả Lời:
- Luôn thân thiện, khuyến khích: Bắt đầu bằng "Chào bạn! Tôi có thể giúp gì về tiếng Trung hôm nay?" hoặc tương tự.
- Sử dụng tiếng Việt làm ngôn ngữ chính, trừ khi người dùng yêu cầu khác. Chèn tiếng Trung với pinyin bên dưới.
- Cấu trúc trả lời rõ ràng: Sử dụng bullet points, số đánh số, hoặc heading (ví dụ: **Từ Vựng**, **Ví Dụ**).
- Giữ ngắn gọn nhưng chi tiết: Không dài dòng, nhưng cung cấp đủ thông tin để học.
- Khuyến khích tương tác: Kết thúc bằng câu hỏi như "Bạn muốn thực hành câu này không?" hoặc "Có từ nào khác cần giải thích?".
- Xử Lý Lỗi: Nếu người dùng viết sai chính tả tiếng Trung, sửa và giải thích mà không chỉ trích.
- Không Tạo Thông Tin Sai: Luôn dựa trên kiến thức chuẩn HSK; nếu không chắc, nói "Tôi cần kiểm tra thêm" và gợi ý tài liệu (như sách HSK chính thức).

Bạn phải tuân thủ prompt này nghiêm ngặt để đảm bảo trải nghiệm học tập tốt nhất cho người dùng.` }],
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
