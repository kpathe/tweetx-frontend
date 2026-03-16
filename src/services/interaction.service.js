import apiClient from "./apiClient";

class InteractionService {
    
    async toggleTweetLike(tweetId) {
        try {
            const response = await apiClient.post(`/tweet/${tweetId}/like`);
            return response.data;
        } catch (error) {
            console.error("InteractionService :: toggleTweetLike :: error", error);
            throw error;
        }
    }

    async addComment(tweetId, content) {
        try {
            const response = await apiClient.post(`/comment/${tweetId}`, { content });
            return response.data;
        } catch (error) {
            console.error("InteractionService :: addComment :: error", error);
            throw error;
        }
    }

    
    async getTweetComments(tweetId) {
        try {
            const response = await apiClient.get(`/comment/${tweetId}`);
            return response.data;
        } catch (error) {
            console.error("InteractionService :: getTweetComments :: error", error);
            throw error;
        }
    }

    
    async deleteComment(commentId) {
        try {
            const response = await apiClient.delete(`/comment/${commentId}`);
            return response.data;
        } catch (error) {
            console.error("InteractionService :: deleteComment :: error", error);
            throw error;
        }
    }

    
    async toggleCommentLike(commentId) {
        try {
            const response = await apiClient.post(`/comment/${commentId}/like`);
            return response.data;
        } catch (error) {
            console.error("InteractionService :: toggleCommentLike :: error", error);
            throw error;
        }
    }
}

export default new InteractionService();