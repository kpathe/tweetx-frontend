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

  async signup(data) {
    try {
      const response = await apiClient.post("/user/signup", data);

      if (response.data && response.status < 400) {
        const email = data.get("email");
        const password = data.get("password");
        return this.login({
          email,
          password,
        });
      } else {
        return response.data;
      }
    } catch (error) {
      console.log("This is an error : ", error.response?.data);
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
