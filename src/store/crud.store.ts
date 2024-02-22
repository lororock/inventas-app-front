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

    const create = async (dataReq: any) => {
      const { data } = await axiosInstance.post(entityConfig.path, dataReq);
      return data;
    };

    const update = async (id: string, dataReq: any) => {
      const { data } = await axiosInstance.patch(
        `${entityConfig.path}/${id}`,
        dataReq,
      );
      return data;
    };

    const customRequest = async ({
      method,
      path,
      body,
      params,
    }: {
      method: string;
      path: string;
      body?: any;
      params?: string;
    }) => {
      const config: any = {
        method: method,
        url: path,
      };

      config.data = body || undefined;

      if (params) {
        config.params = new URLSearchParams();
        Object.keys(params).forEach((key: any) => {
          config.params.append(key, params[key]);
        });
      }

      const { data } = await axiosInstance(config);
      return data;
    };

    return {
      findAll,
      findById,
      create,
      update,
      customRequest,
    };
  });

export default useCrudStore;
