const API_URL = "http://your-backend-url/api/users";

export const authService = {
  async signup(data: SignUpData) {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: SignInData) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.token) {
      localStorage.setItem("token", result.token);
    }
    return result;
  },

  logout() {
    localStorage.removeItem("token");
  },
};
