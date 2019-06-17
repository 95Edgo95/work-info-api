import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export default class RequestService {
  service: AxiosInstance = axios;
  baseUrl: string = "https://api.myjson.com/bins";
  myJsonId: string = "";

  get(config: AxiosRequestConfig = {}, url: string = this.myJsonId): Promise<any> {
    return this.service({ ...config, url: `${this.baseUrl}${url ? `/${url}` : ""}`, method: "GET" }).then(({ data }) => data);
  }

  post(config: AxiosRequestConfig = {}, url: string = this.myJsonId): Promise<any> {
    return this.service({ ...config, url: `${this.baseUrl}${url ? `/${url}` : ""}`, method: "POST" }).then(({ data }) => data);
  }

  put(config: AxiosRequestConfig = {}, url: string = this.myJsonId): Promise<any> {
    return this.service({ ...config, url: `${this.baseUrl}${url ? `/${url}` : ""}`, method: "PUT" }).then(({ data }) => data);
  }
}
