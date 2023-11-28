import { defineStore } from "pinia";
import axiosInstance from "../services/axios.service.ts";

const useEnterpriseStore = defineStore("user", () => {
  const listEmployees = async () => {
    const { data } = await axiosInstance.get("users");
    return data;
  };

  const findUserById = async (id: string) => {
    const { data } = await axiosInstance.get(`users/${id}`);
    return data;
  };

  return {
    listEmployees,
    findUserById,
  };
});

export default useEnterpriseStore;
