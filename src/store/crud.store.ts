import { defineStore } from "pinia";
import entityConfig from "../interface/entity.config.ts";
import axiosInstance from "../services/axios.service.ts";
import PaginationInterface from "../interface/pagination.interface.ts";

const useCrudStore = (entityConfig: entityConfig) =>
  defineStore(entityConfig.name, () => {
    const findAll = async ({ page, limit }: PaginationInterface) => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      const { data } = await axiosInstance.get(entityConfig.path, { params });
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
