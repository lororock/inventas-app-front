import { defineStore } from "pinia";
import axiosInstance from "../services/axios.service.ts";

const useUserStore = defineStore("user", () => {
  const listEmployees = async () => {
    const { data } = await axiosInstance.get("users");
    return data;
  };

  const findUserById = async (id: string) => {
    const { data } = await axiosInstance.get(`users/${id}`);
    return data;
  };

  const createUser = async (data: any) =>
    await axiosInstance.post("users", data);

  const updateUserById = async (data: any, id: string) =>
    await axiosInstance.patch(`users/${id}`, data);

  return {
    listEmployees,
    findUserById,
    createUser,
    updateUserById,
  };
});

export default useUserStore;
