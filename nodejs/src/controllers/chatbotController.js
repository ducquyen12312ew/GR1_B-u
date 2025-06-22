import chatbotService from "../service/chatbotService";

// Controller xử lý tin nhắn chat
let handleChatMessage = async (req, res) => {
  try {
    console.log("📨 Received chat request from:", req.ip);
    console.log("🔍 REQUEST BODY:", JSON.stringify(req.body, null, 2));

    const { message, conversationHistory } = req.body;
    console.log("🔍 MESSAGE:", message);
    console.log(
      "🔍 HISTORY LENGTH:",
      conversationHistory ? conversationHistory.length : 0
    );

    // Validate input
    if (!message || typeof message !== "string") {
      console.log("❌ Invalid message format");
      return res.status(400).json({
        errorCode: 1,
        message: "Tin nhắn không hợp lệ hoặc bị thiếu",
        timestamp: new Date().toISOString(),
      });
    }

    // Kiểm tra tin nhắn quá dài
    if (message.length > 1000) {
      console.log("❌ Message too long");
      return res.status(400).json({
        errorCode: 1,
        message: "Tin nhắn quá dài. Vui lòng rút gọn dưới 1000 ký tự.",
        timestamp: new Date().toISOString(),
      });
    }

    console.log(
      "💬 Processing message:",
      message.substring(0, 50) + (message.length > 50 ? "..." : "")
    );

    // Kiểm tra quick response trước (nhanh và tiết kiệm)
    console.log("🔍 Checking for quick response...");
    const quickResponse = chatbotService.getQuickResponse(message);

    if (quickResponse) {
      console.log("⚡ Using quick response");
      const response = {
        ...quickResponse,
        timestamp: new Date().toISOString(),
        responseTime: "instant",
      };
      console.log(
        "📤 Sending quick response:",
        JSON.stringify(response, null, 2)
      );
      return res.status(200).json(response);
    }

    // Gọi OpenAI API cho câu hỏi phức tạp
    console.log("🧠 No quick response found, calling OpenAI API...");
    const startTime = Date.now();

    const response = await chatbotService.getChatbotResponse(
      message,
      conversationHistory || []
    );

    const responseTime = Date.now() - startTime;
    console.log(`✅ OpenAI response completed in ${responseTime}ms`);

    const finalResponse = {
      ...response,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      isQuickResponse: false,
    };

    console.log(
      "📤 Sending OpenAI response:",
      JSON.stringify(finalResponse, null, 2)
    );
    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("💥 Chatbot Controller Error:", error);
    console.error("💥 Error Stack:", error.stack);

    return res.status(500).json({
      errorCode: -1,
      message: "Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller lấy thống kê chatbot (optional)
let getChatbotStats = async (req, res) => {
  try {
    console.log("📊 Getting chatbot stats...");
    const stats = {
      totalMessages: 0,
      activeUsers: 0,
      averageResponseTime: "250ms",
      topQuestions: [
        "Làm sao để đặt lịch khám?",
        "Giá khám bệnh như thế nào?",
        "Hủy lịch khám thế nào?",
      ],
      status: "active",
      lastUpdated: new Date().toISOString(),
    };

    return res.status(200).json({
      errorCode: 0,
      data: stats,
      message: "Lấy thống kê chatbot thành công",
    });
  } catch (error) {
    console.error("❌ Chatbot Stats Error:", error);
    return res.status(500).json({
      errorCode: -1,
      message: "Lỗi khi lấy thống kê chatbot",
    });
  }
};

// Controller test health check
let healthCheck = async (req, res) => {
  try {
    console.log("🏥 Performing health check...");

    // Test OpenAI connection
    const isOpenAIWorking = await chatbotService.testOpenAIConnection();

    const healthStatus = {
      status: "healthy",
      chatbot: "active",
      openai: isOpenAIWorking ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
    };

    console.log("✅ Health check completed:", healthStatus);
    return res.status(200).json({
      errorCode: 0,
      data: healthStatus,
      message: "Chatbot health check completed",
    });
  } catch (error) {
    console.error("❌ Health Check Error:", error);
    return res.status(500).json({
      errorCode: -1,
      message: "Health check failed",
      error: error.message,
    });
  }
};

// Controller xử lý feedback từ user
let handleFeedback = async (req, res) => {
  try {
    const { rating, comment, messageId } = req.body;

    console.log("📝 Received feedback:", { rating, comment, messageId });

    return res.status(200).json({
      errorCode: 0,
      message:
        "Cảm ơn bạn đã đánh giá! Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Feedback Error:", error);
    return res.status(500).json({
      errorCode: -1,
      message: "Lỗi khi gửi phản hồi",
    });
  }
};

module.exports = {
  handleChatMessage,
  getChatbotStats,
  healthCheck,
  handleFeedback,
};
