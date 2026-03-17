import apiClient from "./apiClient";

class FeedService {
  async getHomeFeed() {
    try {
      const response = await apiClient.get("/feed");
      return response.data;
    } catch (error) {
      console.error("FeedService :: getHomeFeed :: error", error);
      throw error;
    }
  }
}

const feedService = new FeedService();
export default feedService;
