import axios from "axios";

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
//TODO: type
const authInterceptor = (config: any) => {
  console.log("authInter: ", localStorage.getItem("token"));
  config.headers.authorization = localStorage.getItem("token")
    ? `Bearer ${localStorage.getItem("token")}`
    : "";

  return config;
};

$authHost.interceptors.request.use(authInterceptor);
export { $host, $authHost };
