import { defineStore } from "pinia";
import axiosInstance from "../services/axios.service.ts";

const useEnterpriseStore = defineStore("user", () => {
  const listEmployees = async () => {
      const {data}=await axiosInstance.get("users");
      return data
  };

  return {
    listEmployees,
  };
});

export default useEnterpriseStore;
