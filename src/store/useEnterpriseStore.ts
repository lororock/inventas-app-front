import { defineStore } from "pinia";
import axiosInstance from "../services/axios.service.ts";

const useEnterpriseStore = defineStore("enterprise", () => {
  const createEnterprise = async (data: any) => {
    console.log(data);
    await axiosInstance.post("enterprise", data);
  };

  return {
    createEnterprise,
  };
});

export default useEnterpriseStore;
