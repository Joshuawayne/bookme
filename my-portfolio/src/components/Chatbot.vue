<template>
  <div class="chatbot-container">
    <button class="chatbot-toggle" @click="toggleChatbot">
      <span v-if="!isChatOpen">💬 Chat</span>
      <span v-else>Close</span>
    </button>

    <transition name="slide-fade">
      <div class="chatbot-window" v-if="isChatOpen">
        <div class="chatbot-header">
          <h3>Your Assistant</h3>
          <button class="close-btn" @click="closeChatbot">×</button>
        </div>
        <div class="chat-messages" ref="messagesContainer">
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message', message.sender === 'bot' ? 'bot' : 'user']">
            <div v-if="message.type === 'text'" class="text-message">
              {{ message.text }}
            </div>
            <div v-else-if="message.type === 'loading'" class="loading-message">
              <div class="typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
            <div v-else-if="message.type === 'error'" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ message.text }}
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input 
            v-model="currentMessage" 
            type="text" 
            placeholder="Type your message..."
            @keypress.enter="sendMessage"
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="isLoading">
            <span v-if="!isLoading">Send</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default {
  data() {
    return {
      isChatOpen: false,
      currentMessage: '',
      messages: [],
      isLoading: false,
      userId: 'user_123' // This should be replaced with actual user ID in production
    }
  },
  methods: {
    toggleChatbot() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.addInitialGreeting();
      }
    },
    closeChatbot() {
      this.isChatOpen = false;
      this.resetChat();
    },
    addMessage(message) {
      this.messages.push(message);
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    async sendMessage() {
      if (!this.currentMessage.trim()) return;
      if (this.isLoading) return;

      const userMessage = {
        sender: 'user',
        text: this.currentMessage.trim(),
        type: 'text'
      };

      this.addMessage(userMessage);
      this.currentMessage = '';
      this.isLoading = true;

      try {
        this.addMessage({ sender: 'bot', type: 'loading' });

        const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
          message: userMessage.text,
          userId: this.userId
        });

        this.messages = this.messages.filter(m => m.type !== 'loading');
        this.addMessage({
          sender: 'bot',
          text: response.data.response,
          type: 'text'
        });
      } catch (error) {
        console.error('Error sending message:', error);
        this.messages = this.messages.filter(m => m.type !== 'loading');
        this.addMessage({
          sender: 'bot',
          text: error.response?.data?.message || 'An error occurred. Please try again.',
          type: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },
    addInitialGreeting() {
      this.messages = [
        { sender: 'bot', text: 'Hi! I\'m your portfolio assistant. How can I help you today?', type: 'text' },
        { sender: 'bot', text: 'I can help you with:', type: 'text' },
        { sender: 'bot', text: '• Portfolio projects and their details', type: 'text' },
        { sender: 'bot', text: '• Contact information and availability', type: 'text' },
        { sender: 'bot', text: '• Services and expertise', type: 'text' },
        { sender: 'bot', text: '• General questions about my work', type: 'text' }
      ];
    },
    resetChat() {
      this.messages = [];
      this.currentMessage = '';
    }
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom();
      },
      deep: true
    }
  },
  mounted() {
    if (this.isChatOpen) {
      this.addInitialGreeting();
    }
  }
};
</script>

<style scoped>
/* Import CSS variables */
@import '../assets/styles/main.css';

.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chatbot-toggle {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-display);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chatbot-toggle:hover {
  background: #992c1e;
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chatbot-window {
  width: 350px;
  height: 500px;
  background: var(--color-background);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}

.chatbot-header {
  padding: 15px;
  background: var(--color-primary);
  color: white;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-display);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  font-family: var(--font-display);
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: var(--color-background);
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  font-family: var(--font-body);
  line-height: 1.4;
}

.message.user {
  margin-left: auto;
  background: var(--color-primary);
  color: white;
  border-radius: 12px 12px 0 12px;
}

.message.bot {
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 12px 12px 12px 0;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--color-surface);
  border-radius: 12px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--color-text);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  border-radius: 12px;
  padding: 12px;
  font-family: var(--font-body);
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 1.2em;
}

.chat-input {
  padding: 15px;
  display: flex;
  gap: 10px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
  transition: all 0.2s ease;
}

.chat-input input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
}

.chat-input input:disabled {
  background: #f0f0f0;
  color: #888;
  border-color: var(--color-primary);
}

.chat-input button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-family: var(--font-display);
}

.chat-input button:disabled {
  background: var(--color-muted);
  cursor: not-allowed;
}

.chat-input button:hover:not(:disabled) {
  background: #992c1e;
}

/* Animation for slide-fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Responsive design */
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 10px;
    right: 10px;
  }

  .chatbot-window {
    width: 90%;
    height: 400px;
  }

  .chat-input input {
    font-size: 14px;
  }
}

/* Loading state styles */
.message.loading {
  opacity: 0.7;
}

/* Error message styles */
.message.error {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 5px;
  font-family: var(--font-body);
}

/* Success message styles */
.message.success {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 15px;
  border-radius: 5px;
  font-family: var(--font-body);
}

/* Message timestamps */
.message-time {
  font-size: 0.8em;
  color: var(--color-muted);
  margin-top: 5px;
  font-family: var(--font-body);
}

/* Message attachments */
.message.attachment {
  margin-top: 10px;
  padding: 10px;
  background: var(--color-stone-gray);
  border-radius: 5px;
}

.attachment-preview {
  max-width: 100%;
  height: auto;
}

/* Message actions */
.message-actions {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.action-button {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  font-family: var(--font-display);
}

.action-button:hover {
  color: #992c1e;
}

/* Loading state indicators */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-muted);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>