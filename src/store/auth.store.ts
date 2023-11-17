import { ref } from "vue";
import { defineStore } from "pinia";
import router from "../router/index.js";
import axiosInstance from "../services/axios.service.ts";
import Swal from "sweetalert2";

export const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const refreshToken = ref("");

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      token.value = data.token;
      refreshToken.value = data.refreshToken;
      localStorage.setItem("token-inventas", token.value);
      localStorage.setItem("refresh-token-inventas", refreshToken.value);
      await router.push("/form");
    } catch (error: any) {
      await Swal.fire({
        title: error.response.data.message,
        timer: 2000,
        icon: "error",
      });
      throw error;
    }
  };

  const logout = async () => {
    token.value = "";
    localStorage.removeItem("token-inventas");
    localStorage.removeItem("refresh-token-inventas");
    await router.push("/");
  };

  const validTokenRefresh = async () => {
    const refreshTokenTemp = localStorage.getItem("refresh-token-inventas");
    if (!refreshTokenTemp) return false;
    try {
      const { data } = await axiosInstance.post(
        `auth/valid/${refreshTokenTemp}`,
      );
      token.value = data.token;
      refreshToken.value = data.refreshToken;
      localStorage.setItem("token-inventas", token.value);
      localStorage.setItem("refresh-token-inventas", refreshToken.value);
      return true;
    } catch (error) {
      return false;
    }
  };
  return {
    login,
    logout,
    validTokenRefresh,
    token,
  };
});
