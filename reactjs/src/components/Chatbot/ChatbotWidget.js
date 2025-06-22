import React, { useState, useEffect, useRef } from "react";
import "./ChatbotWidget.scss";
import ChatbotService from "../../services/chatbotService";

const ChatbotWidget = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      text: "👋 Xin chào! Tôi là trợ lý AI của BookingCare.\n\n🤖 Tôi có thể giúp bạn:\n• Tư vấn sơ bộ về triệu chứng\n• Hướng dẫn đặt lịch khám\n• Trả lời câu hỏi về dịch vụ\n• Thông tin về bác sĩ\n\n💬 Hãy cho tôi biết bạn cần hỗ trợ gì nhé!",
      sender: "bot",
      timestamp: new Date(),
      isQuickResponse: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  // Handle send message
  const handleSendMessage = async () => {
    console.log("🚀 Frontend Widget: Starting to send message...");

    const validation = ChatbotService.validateMessage(inputValue);

    if (!validation.isValid) {
      console.log(
        "❌ Frontend Widget: Message validation failed:",
        validation.error
      );
      // Show error message
      const errorMessage = {
        id: ChatbotService.generateMessageId(),
        text: `❌ ${validation.error}`,
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    console.log("✅ Frontend Widget: Message validation passed");

    const userMessage = {
      id: ChatbotService.generateMessageId(),
      text: validation.message,
      sender: "user",
      timestamp: new Date(),
    };

    console.log("📝 Frontend Widget: Adding user message to state");
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Check if online
      if (!isConnected) {
        console.log("📡 Frontend Widget: User is offline");
        const offlineResponse = ChatbotService.getOfflineResponse(
          validation.message
        );
        const botMessage = {
          id: ChatbotService.generateMessageId(),
          text: offlineResponse.message,
          sender: "bot",
          timestamp: new Date(),
          isOffline: true,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }

      // Get conversation history
      console.log("📜 Frontend Widget: Formatting conversation history...");
      const conversationHistory =
        ChatbotService.formatConversationHistory(messages);

      // Send to backend
      console.log("📤 Frontend Widget: Calling ChatbotService.sendMessage...");
      const response = await ChatbotService.sendMessage(
        validation.message,
        conversationHistory
      );

      console.log("📥 Frontend Widget: Received response:", response);

      // 🔧 FIX: Kiểm tra response structure cẩn thận
      let botMessageText = "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.";
      let isQuickResponse = false;
      let responseTime = "unknown";
      let hasError = false;

      if (response && typeof response === "object") {
        if (response.errorCode === 0 && response.message) {
          console.log("✅ Frontend Widget: Success response received");
          botMessageText = response.message;
          isQuickResponse = response.isQuickResponse || false;
          responseTime = response.responseTime || "unknown";
        } else {
          console.log("⚠️ Frontend Widget: Error response received:", response);
          botMessageText = response.message || "Có lỗi xảy ra từ server.";
          hasError = true;
        }
      } else {
        console.log(
          "❌ Frontend Widget: Invalid response structure:",
          response
        );
        botMessageText = "Phản hồi từ server không hợp lệ.";
        hasError = true;
      }

      const botMessage = {
        id: ChatbotService.generateMessageId(),
        text: botMessageText,
        sender: "bot",
        timestamp: new Date(),
        isQuickResponse: isQuickResponse,
        responseTime: responseTime,
        isError: hasError,
      };

      console.log(
        "📝 Frontend Widget: Adding bot message to state:",
        botMessage
      );
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("💥 Frontend Widget: Send message error:", error);
      const errorMessage = {
        id: ChatbotService.generateMessageId(),
        text: "Có lỗi kết nối xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      console.log("🏁 Frontend Widget: Finished processing message");
      setIsTyping(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick message buttons
  const quickMessages = [
    "Làm sao để đặt lịch khám?",
    "Giá khám bệnh như thế nào?",
    "Tôi bị đau đầu, làm sao?",
    "Hủy lịch khám thế nào?",
  ];

  const handleQuickMessage = (message) => {
    console.log("⚡ Frontend Widget: Quick message selected:", message);
    setInputValue(message);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format message text với line breaks
  const formatMessageText = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Handle feedback
  const handleFeedback = async (messageId, rating) => {
    try {
      console.log("👍👎 Frontend Widget: Sending feedback:", messageId, rating);
      await ChatbotService.sendFeedback(messageId, rating);
      console.log("✅ Frontend Widget: Feedback sent successfully");
    } catch (error) {
      console.error("❌ Frontend Widget: Feedback error:", error);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div
        className={`chatbot-widget-button ${isOpen ? "active" : ""} ${
          !isConnected ? "offline" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title={
          isConnected
            ? isOpen
              ? "Đóng chat"
              : "Mở chat"
            : "Offline - Không có kết nối"
        }
      >
        <i className={isOpen ? "fas fa-times" : "fas fa-comments"}></i>
        {!isConnected && <div className="offline-indicator"></div>}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-widget-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="chatbot-info">
                <h4>Trợ lý AI BookingCare</h4>
                <span
                  className={`status ${isConnected ? "online" : "offline"}`}
                >
                  {isConnected ? "Đang hoạt động" : "Offline"}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender} ${
                  message.isError ? "error" : ""
                } ${message.isOffline ? "offline" : ""}`}
              >
                <div className="message-content">
                  {formatMessageText(message.text)}
                  {message.isQuickResponse && (
                    <div className="response-badge">⚡ Trả lời nhanh</div>
                  )}
                </div>
                <div className="message-meta">
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.responseTime && (
                    <span className="response-time">
                      {" "}
                      • {message.responseTime}
                    </span>
                  )}
                  {message.sender === "bot" &&
                    !message.isError &&
                    !message.isOffline && (
                      <div className="message-feedback">
                        <button
                          onClick={() => handleFeedback(message.id, 1)}
                          title="Hữu ích"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, -1)}
                          title="Không hữu ích"
                        >
                          👎
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="typing-text">Đang trả lời...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Messages */}
          {messages.length <= 1 && (
            <div className="quick-messages">
              <div className="quick-messages-header">💡 Câu hỏi gợi ý:</div>
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  className="quick-message-btn"
                  onClick={() => handleQuickMessage(msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isConnected ? "Nhập tin nhắn..." : "Không có kết nối internet"
                }
                rows="1"
                disabled={!isConnected || isTyping}
                maxLength="1000"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isConnected || isTyping}
                className="send-btn"
                title="Gửi tin nhắn"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="input-footer">
              <span className="char-count">{inputValue.length}/1000</span>
              {!isConnected && (
                <span className="offline-warning">
                  ⚠️ Không có kết nối internet
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
