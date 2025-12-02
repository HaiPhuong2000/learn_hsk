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

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create chat with system context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Bạn là một trợ lý AI chuyên về tiếng Trung và HSK (Hanyu Shuiping Kaoshi). Nhiệm vụ của bạn là giúp người dùng học từ vựng, ngữ pháp, và luyện thi HSK. Hãy trả lời bằng tiếng Việt, giải thích rõ ràng và dễ hiểu. Khi cần thiết, hãy cung cấp ví dụ bằng tiếng Trung có Pinyin và dịch nghĩa.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Chào bạn! Tôi là trợ lý AI chuyên về tiếng Trung và HSK. Tôi sẵn sàng giúp bạn học từ vựng, ngữ pháp, luyện tập và giải đáp mọi thắc mắc về tiếng Trung. Hãy hỏi tôi bất cứ điều gì bạn cần!' }],
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
