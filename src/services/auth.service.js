import apiClient from "../api/axios"; // Your axios instance

export class AuthService {
  async login({ email, password }) {
    try {
      const response = await apiClient.post("/user/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("AuthService :: login :: error", error);
      throw error;
    }
  }

  async signup({ fullName, email, password, profileImage }) {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    try {
      const response = await apiClient.post("/user/signup", formData);

      if (response.data && response.status < 400) {
        return this.login({ email, password });
      } else {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout() {
    try {
      await apiClient.get("/user/logout");
    } catch (error) {
      console.log();
      throw error;
    }
  }

  async verifyEmail({ token }) {
    try {
      const response = await apiClient.post(`user/verify/${token}`);

      return response.message;
    } catch (error) {
      console.log("UserService :: verifyEmail :: error", error);
      throw error;
    }
  }

  async forgotPassword({ email }) {
    try {
      const response = await apiClient.post("user/forgot-password", { email });
      return response.message;
    } catch (error) {
      console.log("UserService :: forgotPassword :: error", error);
      throw error;
    }
  }

  async resetPassword({ token, newPassword }) {
    try {
      const response = await apiClient.post(`user/reset-password/${token}`, {
        newPassword,
      });
      return response.message;
    } catch (error) {
      console.log("UserService :: resetPassword :: error", error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post("/user/refresh-token", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("AuthService :: refreshToken :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
