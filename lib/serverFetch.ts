import { getCookie } from "@/services/auth/tokenHandler";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

export const serverFetchHelper = async (
  endPoint: string,
  options: RequestInit = {}
) => {
  const { headers, ...restOptions } = options;
  const accessToken = await getCookie("accessToken");

  const combinedHeaders: Record<string, string> = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(accessToken ? { Cookie: `accessToken=${accessToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  const url = endPoint.startsWith("http") ? endPoint : `${SERVER_URL}${endPoint.startsWith("/") ? "" : "/"}${endPoint}`;

  const response = await fetch(url, {
    credentials: "include",
    headers: combinedHeaders,
    ...restOptions,
  });

  return response;
};

export const serverFetch = {
  get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
