// 🔧 FIX: Polyfill cho Headers và fetch
import fetch, { Headers } from "node-fetch";

// Polyfill cho Node.js
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
if (!globalThis.Headers) {
  globalThis.Headers = Headers;
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // 🆕 THÊM: Custom fetch với headers
  fetch: fetch,
});

// System prompt cho chatbot y tế
const SYSTEM_PROMPT = `
Bạn là một trợ lý AI thông minh của hệ thống y tế BookingCare. 
Nhiệm vụ của bạn:
1. Tư vấn sơ bộ về triệu chứng (KHÔNG chẩn đoán)
2. Hướng dẫn đặt lịch khám
3. Trả lời câu hỏi về dịch vụ bệnh viện
4. Đưa ra lời khuyên sức khỏe tổng quát

Quy tắc quan trọng:
- KHÔNG bao giờ chẩn đoán bệnh cụ thể
- Luôn khuyên bệnh nhân đến gặp bác sĩ khi cần thiết
- Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
- Nếu câu hỏi ngoài phạm vi y tế, hướng dẫn người dùng liên hệ support
- Giữ câu trả lời ngắn gọn, dễ hiểu
`;

let getChatbotResponse = async (userMessage, conversationHistory = []) => {
  try {
    console.log("🤖 Processing OpenAI message:", userMessage);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log("✅ OpenAI response generated successfully");

    return {
      errorCode: 0,
      message: response,
    };
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);

    // Xử lý các loại lỗi khác nhau
    if (error.code === "insufficient_quota") {
      return {
        errorCode: 2,
        message:
          "Hệ thống đang quá tải. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      };
    } else if (error.code === "invalid_api_key") {
      return {
        errorCode: 3,
        message: "Lỗi cấu hình hệ thống. Vui lòng liên hệ admin.",
      };
    } else {
      return {
        errorCode: 1,
        message:
          "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      };
    }
  }
};

// 🔧 FIX: Responses được định sẵn cho các câu hỏi thường gặp
const getQuickResponse = (message) => {
  console.log("🔍 Checking quick response for:", message);
  const lowerMessage = message.toLowerCase().trim();

  // Câu chào hỏi - ƯU TIÊN KIỂM TRA TRƯỚC
  if (
    lowerMessage.includes("xin chào") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage === "chào"
  ) {
    console.log("✅ Found greeting quick response");
    return {
      errorCode: 0,
      message:
        "👋 Xin chào! Tôi là trợ lý AI của BookingCare\n\n🤖 Tôi có thể giúp bạn:\n• Tư vấn sơ bộ về triệu chứng\n• Hướng dẫn đặt lịch khám\n• Trả lời câu hỏi về dịch vụ\n• Thông tin về bác sĩ\n\n💬 Hãy cho tôi biết bạn cần hỗ trợ gì nhé!",
      isQuickResponse: true,
    };
  }

  // Câu hỏi về đặt lịch
  if (
    lowerMessage.includes("đặt lịch") ||
    lowerMessage.includes("book") ||
    lowerMessage.includes("hẹn khám") ||
    lowerMessage.includes("hướng dẫn")
  ) {
    console.log("✅ Found booking quick response");
    return {
      errorCode: 0,
      message:
        "📅 Để đặt lịch khám, bạn có thể:\n\n1. Chọn bác sĩ từ danh sách trên trang chủ\n2. Chọn thời gian phù hợp\n3. Điền thông tin cá nhân\n4. Xác nhận đặt lịch\n\n💡 Tip: Nên đặt lịch trước 1-2 ngày để có slot tốt nhất\n\nBạn có cần hỗ trợ thêm không?",
      isQuickResponse: true,
    };
  }

  // Câu hỏi về giá cả
  if (
    lowerMessage.includes("giá") ||
    lowerMessage.includes("phí") ||
    lowerMessage.includes("tiền")
  ) {
    console.log("✅ Found price quick response");
    return {
      errorCode: 0,
      message:
        "💰 Chi phí khám bệnh phụ thuộc vào:\n\n• Loại dịch vụ khám\n• Bác sĩ được chọn\n• Gói khám sức khỏe\n• Thời gian khám (ngày thường/cuối tuần)\n\n📋 Vui lòng xem thông tin chi tiết trên trang bác sĩ hoặc liên hệ hotline 1900-xxxx để biết chính xác.",
      isQuickResponse: true,
    };
  }

  // Câu hỏi về hủy lịch
  if (lowerMessage.includes("hủy lịch") || lowerMessage.includes("cancel")) {
    console.log("✅ Found cancel quick response");
    return {
      errorCode: 0,
      message:
        "❌ Để hủy lịch khám:\n\n1. Vào mục 'Lịch khám của tôi'\n2. Chọn lịch cần hủy\n3. Nhấn 'Hủy lịch'\n4. Xác nhận hủy\n\n⚠️ Lưu ý: Nên hủy trước 24h để tránh phí phạt và giúp bệnh nhân khác có cơ hội đặt lịch.",
      isQuickResponse: true,
    };
  }

  // Câu hỏi về triệu chứng cơ bản
  if (lowerMessage.includes("đau đầu") || lowerMessage.includes("headache")) {
    console.log("✅ Found headache quick response");
    return {
      errorCode: 0,
      message:
        "🤕 Về triệu chứng đau đầu:\n\n**Có thể do:**\n• Căng thẳng, stress\n• Thiếu ngủ\n• Mất nước\n• Áp lực công việc\n\n**Cách giảm đau tạm thời:**\n• Nghỉ ngơi trong phòng tối\n• Uống đủ nước\n• Massage nhẹ vùng thái dương\n\n⚠️ Nên đặt lịch khám nếu: Đau kéo dài >2 ngày, đau dữ dội, kèm sốt hoặc buồn nôn.",
      isQuickResponse: true,
    };
  }

  // Test message
  if (lowerMessage.includes("test") || lowerMessage.includes("testing")) {
    console.log("✅ Found test quick response");
    return {
      errorCode: 0,
      message:
        "🧪 Đây là tin nhắn test! Chatbot đang hoạt động bình thường.\n\nBạn có thể thử các câu hỏi như:\n• Xin chào\n• Đặt lịch khám\n• Giá khám bệnh\n• Hủy lịch khám",
      isQuickResponse: true,
    };
  }

  console.log("❌ No quick response found for:", message);
  return null;
};

// Test function đơn giản hơn
const testOpenAIConnection = async () => {
  try {
    // Test với quick response trước
    console.log("🧪 Testing quick response...");
    const quickTest = getQuickResponse("xin chào");
    if (quickTest) {
      console.log("✅ Quick Response working!");
      return true;
    }

    // Nếu không có quick response, test OpenAI
    console.log("🧪 Testing OpenAI connection...");
    const response = await getChatbotResponse("Hello");
    console.log(
      "🧪 OpenAI Test Result:",
      response.errorCode === 0 ? "✅ Success" : "❌ Failed"
    );
    return response.errorCode === 0;
  } catch (error) {
    console.error("🧪 OpenAI Test Failed:", error.message);
    return false;
  }
};

module.exports = {
  getChatbotResponse,
  getQuickResponse,
  testOpenAIConnection,
};
