import { ref } from "vue";
import { defineStore } from "pinia";
import router from "../router/index.js";
import axiosInstance from "../services/axios.service.ts";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);
  const token = ref("");
  const refreshToken = ref("");

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      token.value = data.token;
      user.value = jwtDecode(token.value);
      refreshToken.value = data.refreshToken;
      localStorage.setItem("token-inventas", token.value);
      localStorage.setItem("refresh-token-inventas", refreshToken.value);
      await router.push("/home");
    } catch (error: any) {
      await Swal.fire({
        title: "Error en login",
        text: error.response.data.message,
        timer: 2000,
        icon: "error",
      });
      throw error;
    }
  };

  const setToken = (tokenValue: string) => (token.value = tokenValue);

  const logout = async () => {
    token.value = "";
    user.value = null;
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
      user.value = jwtDecode(token.value);
      refreshToken.value = data.refreshToken;
      localStorage.setItem("token-inventas", token.value);
      localStorage.setItem("refresh-token-inventas", refreshToken.value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const loadUser = () => {
    const token = localStorage.getItem("token-inventas") as string;
    user.value = jwtDecode(token);
  };
  return {
    login,
    logout,
    validTokenRefresh,
    setToken,
    token,
    user,
    loadUser,
  };
});
