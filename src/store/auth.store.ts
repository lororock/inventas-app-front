import { defineStore } from "pinia";
import axiosInstance from "../services/axios.service.ts";
import Swal from "sweetalert2";

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
        await Swal.fire({
          title: error.response.data.message,
          timer: 2000,
          icon: "error",
        });
        throw error;
      }
    },
  },
});

export default authStore;
