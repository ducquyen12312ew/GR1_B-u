import chatbotAxios from "./chatbotAxios"; // Thay vì import chatbotAxios từ '../chatbotAxios'

// 🚀 Service xử lý API calls cho chatbot
class ChatbotService {
  // Gửi tin nhắn đến backend
  static async sendMessage(message, conversationHistory = []) {
    try {
      console.log("📤 Frontend: Sending message to backend:", message);
      console.log(
        "📤 Frontend: Conversation history length:",
        conversationHistory.length
      );

      const requestData = {
        message: message.trim(),
        conversationHistory: conversationHistory,
      };

      console.log(
        "📤 Frontend: Request data:",
        JSON.stringify(requestData, null, 2)
      );

      const response = await chatbotAxios.post(
        "/api/chatbot/message",
        requestData
      );

      console.log("📥 Frontend: Received response status:", response.status);
      console.log(
        "📥 Frontend: Received response data:",
        JSON.stringify(response.data, null, 2)
      );

      // Kiểm tra response structure
      if (response.data && typeof response.data === "object") {
        if (response.data.errorCode === 0) {
          console.log("✅ Frontend: Success response");
          return response.data;
        } else {
          console.log("⚠️ Frontend: Error response from backend");
          return response.data;
        }
      } else {
        console.log("❌ Frontend: Invalid response structure");
        return {
          errorCode: -1,
          message: "Phản hồi từ server không hợp lệ",
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error("❌ Frontend: Chatbot API Error:", error);
      console.error("❌ Frontend: Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      // Xử lý lỗi network hoặc server
      if (error.response) {
        // Server trả về response với error code
        console.log("❌ Frontend: Server error response");
        return {
          errorCode: error.response.data?.errorCode || -1,
          message: error.response.data?.message || "Lỗi từ server",
          timestamp: new Date().toISOString(),
        };
      } else if (error.request) {
        // Network error
        console.log("❌ Frontend: Network error");
        return {
          errorCode: -2,
          message: "Không thể kết nối đến server. Vui lòng kiểm tra internet.",
          timestamp: new Date().toISOString(),
        };
      } else {
        // Lỗi khác
        console.log("❌ Frontend: Other error");
        return {
          errorCode: -3,
          message: "Có lỗi xảy ra. Vui lòng thử lại.",
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  // Gửi feedback cho tin nhắn
  static async sendFeedback(messageId, rating, comment = "") {
    try {
      console.log("📤 Frontend: Sending feedback:", {
        messageId,
        rating,
        comment,
      });

      const response = await chatbotAxios.post("/api/chatbot/feedback", {
        messageId,
        rating,
        comment,
      });

      console.log("✅ Frontend: Feedback sent successfully");
      return response.data;
    } catch (error) {
      console.error("❌ Frontend: Feedback Error:", error);
      return {
        errorCode: -1,
        message: "Không thể gửi feedback",
      };
    }
  }

  // Lấy thống kê chatbot
  static async getStats() {
    try {
      const response = await chatbotAxios.get("/api/chatbot/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Frontend: Stats Error:", error);
      return {
        errorCode: -1,
        message: "Không thể lấy thống kê",
      };
    }
  }

  // Kiểm tra health của chatbot
  static async healthCheck() {
    try {
      console.log("🏥 Frontend: Performing health check...");
      const response = await chatbotAxios.get("/api/chatbot/health");
      console.log("✅ Frontend: Health check successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Frontend: Health Check Error:", error);
      return {
        errorCode: -1,
        message: "Không thể kiểm tra trạng thái hệ thống",
      };
    }
  }

  // Xử lý tin nhắn offline (khi không có internet)
  static getOfflineResponse(message) {
    const offlineResponses = [
      "🔌 Bạn đang offline. Vui lòng kiểm tra kết nối internet.",
      "📡 Không thể kết nối đến server. Thử lại sau nhé!",
      "🌐 Đang mất kết nối. Chatbot sẽ hoạt động lại khi có internet.",
    ];

    return {
      errorCode: -2,
      message:
        offlineResponses[Math.floor(Math.random() * offlineResponses.length)],
      isOffline: true,
      timestamp: new Date().toISOString(),
    };
  }

  // Format lịch sử hội thoại cho API
  static formatConversationHistory(messages, maxMessages = 10) {
    console.log(
      "🔄 Frontend: Formatting conversation history, total messages:",
      messages.length
    );

    const formatted = messages
      .slice(-maxMessages) // Lấy 10 tin nhắn gần nhất
      .filter((msg) => msg.sender && msg.text) // Lọc tin nhắn hợp lệ
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

    console.log(
      "🔄 Frontend: Formatted history:",
      JSON.stringify(formatted, null, 2)
    );
    return formatted;
  }

  // Validate tin nhắn trước khi gửi
  static validateMessage(message) {
    console.log("🔍 Frontend: Validating message:", message);

    if (!message || typeof message !== "string") {
      console.log("❌ Frontend: Invalid message type");
      return {
        isValid: false,
        error: "Tin nhắn không hợp lệ",
      };
    }

    if (message.trim().length === 0) {
      console.log("❌ Frontend: Empty message");
      return {
        isValid: false,
        error: "Tin nhắn không được để trống",
      };
    }

    if (message.length > 1000) {
      console.log("❌ Frontend: Message too long");
      return {
        isValid: false,
        error: "Tin nhắn quá dài (tối đa 1000 ký tự)",
      };
    }

    console.log("✅ Frontend: Message validation passed");
    return {
      isValid: true,
      message: message.trim(),
    };
  }

  // Tạo unique ID cho message
  static generateMessageId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Kiểm tra internet connection
  static isOnline() {
    return navigator.onLine;
  }
}

export default ChatbotService;
