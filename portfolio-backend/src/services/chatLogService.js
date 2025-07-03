// portfolio-backend/src/services/chatLogService.js
const supabase = require('../config/supabase');

/**
 * @module chatLogService
 * @description Service for managing chatbot conversation logs
 * Follows clean code principles and provides robust logging functionality
 */

/**
 * @class ChatLogService
 * @description Manages chatbot conversation logging and retrieval
 */
class ChatLogService {
    /**
     * Logs a user message to the database
     * @param {string} userId - The user's ID
     * @param {string} message - The user's message
     * @returns {Promise<Object>} - The logged message data
     */
    async logMessage(userId, message) {
        try {
            const { data, error } = await supabase
                .from('chat_conversations')
                .insert([{
                    user_id: userId,
                    message_type: 'user',
                    message_content: message,
                    status: 'active'
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error logging user message:', error);
            throw error;
        }
    }

    /**
     * Logs an AI response to the database
     * @param {string} userId - The user's ID
     * @param {string} response - The AI's response
     * @param {string} contextMessageId - The ID of the user message this response is replying to
     * @returns {Promise<Object>} - The logged response data
     */
    async logAIResponse(userId, response, contextMessageId) {
        try {
            const { data, error } = await supabase
                .from('chat_conversations')
                .insert([{
                    user_id: userId,
                    message_type: 'ai',
                    message_content: response,
                    context_message_id: contextMessageId,
                    status: 'active'
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error logging AI response:', error);
            throw error;
        }
    }

    /**
     * Retrieves conversation history for a user
     * @param {string} userId - The user's ID
     * @returns {Promise<Array>} - Array of conversation messages
     */
    async getConversationHistory(userId) {
        try {
            const { data, error } = await supabase
                .from('chat_conversations')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching conversation history:', error);
            throw error;
        }
    }

    /**
     * Updates the status of a message
     * @param {string} messageId - The ID of the message to update
     * @param {string} status - The new status ('active', 'archived', 'deleted')
     * @returns {Promise<void>}
     */
    async updateMessageStatus(messageId, status) {
        try {
            const { error } = await supabase
                .from('chat_conversations')
                .update({ status })
                .eq('id', messageId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating message status:', error);
            throw error;
        }
    }

    /**
     * Retrieves unread messages for a user
     * @returns {Promise<Array>} - Array of unread messages
     */
    async getUnreadMessages() {
        try {
            const { data, error } = await supabase
                .from('chat_conversations')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching unread messages:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const instance = new ChatLogService();
module.exports = instance;