import apiClient from "../api/axios";

class TweetService {
  async createTweet({ content, image }) {
    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await apiClient.post("/tweet", formData);
      return response.data;
    } catch (error) {
      console.error("TweetService :: createTweet :: error", error);
      throw error;
    }
  }

  async getTweet(tweetId) {
    try {
      const response = await apiClient.get(`/tweet/${tweetId}`);
      return response.data;
    } catch (error) {
      console.error("TweetService :: getTweet :: error", error);
      throw error;
    }
  }

  async deleteTweet(tweetId) {
    try {
      const response = await apiClient.delete(`/tweet/${tweetId}`);
      return response.data;
    } catch (error) {
      console.error("TweetService :: deleteTweet :: error", error);
      throw error;
    }
  }
}

const tweetService = new TweetService();
export default tweetService;
