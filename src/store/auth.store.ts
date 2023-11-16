import { ref } from "vue";
import { defineStore } from "pinia";
import router from "../router/index.js";
import axiosInstance from "../services/axios.service.ts";
import Swal from "sweetalert2";

export const useAuthStore = defineStore("auth", () => {
  const token = ref("");

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      token.value = data.token;
      router.push("/form");
      localStorage.setItem("token-inventas", token.value);
    } catch (error) {
      await Swal.fire({
        title: error.response.data.message,
        timer: 2000,
        icon: "error",
      });
      throw error;
    }
  };

  const logout = () => {
    token.value == "";
    localStorage.removeItem("token-inventas");
    router.push("/");
  };
  return {
    login,
    logout,
    token,
  };
});
