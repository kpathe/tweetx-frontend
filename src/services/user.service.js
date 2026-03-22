import apiClient from "../api/axios";

class UserService {
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`/user/me`);
      return response.data;
    } catch (error) {
      console.error("UserService :: getCurrentUser :: error", error);
      throw error;
    }
  }

  async getProfile(username) {
    try {
      const response = await apiClient.get(`/user/profile/${username}`);
      return response.data;
    } catch (error) {
      console.error("UserService :: getProfile :: error", error);
      throw error;
    }
  }

  async editProfile({ newFullName, newEmail, profileImage }) {
    const formData = new FormData();
    if (newFullName) formData.append("newFullName", newFullName);
    if (newEmail) formData.append("newEmail", newEmail);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const response = await apiClient.post("/user/edit-profile", formData);
      return response.data;
    } catch (error) {
      console.error("UserService :: editProfile :: error", error);
      throw error;
    }
  }

  async changePassword({ oldPassword, newPassword }) {
    try {
      const response = await apiClient.post("/user/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("UserService :: changePassword :: error", error);
      throw error;
    }
  }

  async follow(userId) {
    try {
      const response = await apiClient.post(`/user/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("UserService :: follow :: error", error);
      throw error;
    }
  }

  async unfollow(userId) {
    try {
      const response = await apiClient.post(`/user/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("UserService :: unfollow :: error", error);
      throw error;
    }
  }

  async deleteAccount() {
    try {
      const response = await apiClient.post("/user/delete-account");
      return response.data;
    } catch (error) {
      console.error("UserService :: deleteAccount :: error", error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
