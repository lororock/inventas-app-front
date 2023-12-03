import { defineStore } from "pinia";
import entityConfig from "../interface/entity.config.ts";
import axiosInstance from "../services/axios.service.ts";

const useCrudStore = (entityConfig: entityConfig) =>
  defineStore(entityConfig.name, () => {
    const findAll = async () => {
      const { data } = await axiosInstance.get(entityConfig.path);
      return data;
    };

    const findById = async (id: string) => {
      const { data } = await axiosInstance.get(`${entityConfig.path}/${id}`);
      return data;
    };

    return {
      findAll,
      findById,
    };
  });

export default useCrudStore;
