import apiClient from "../api/apiClient"; // Your axios instance

export class AuthService {
  // 1. Create a login method that takes 'data' as an argument
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

  // 2. Create a signup/register method
  async createAccount({ fullName, email, password, profileImage }) {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    // eslint-disable-next-line no-useless-catch
    try {
      const userAccount = await apiClient.post("/user/signup", formData);

      if (userAccount.data && userAccount.status < 400) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  // 3. Create a logout method
  async logout() {
    // eslint-disable-next-line no-useless-catch
    try {
        await apiClient.get("/user/logout")
    } catch (error) {
        throw error
    }
  }

  // 4. Create a method to get the current user
  // (Crucial for keeping the user logged in after a page refresh)
  async getUserProfile(id) {
    try {
        const response = await apiClient.get(`/user/profile/${id}`)

        return response.data
    } catch (error) {
        console.error("UserService :: getCurrentUser :: error", error);
        throw error;
    }
  }
}

// Export an instance of the class
const authService = new AuthService();
export default authService;
