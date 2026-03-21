import apiClient from "../api/axios";

class TweetService {
  async createTweet(data) {
    try {
      const response = await apiClient.post("/tweet", data);
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
