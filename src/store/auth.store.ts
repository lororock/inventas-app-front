import { defineStore } from "pinia";
import axiosInstance from "../services/axios.service.ts";

export const authStore = defineStore("auth", {
  state: () => ({
    token: "",
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const { data } = await axiosInstance.post("auth/login", {
          email,
          password,
        });
        this.token = data.token;
        localStorage.setItem("token-inventas", this.token);
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
  },
});

export default authStore;
