const BASE_URL = new URL(import.meta.env.VITE_API_URL);

export const httpFetchRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const API_URL = new URL(endpoint, BASE_URL);

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (data.status !== "Success!") throw data;

  return data;
};

////////////////////////////////////////////
export const api = {
  get: (endpoint, config = {}) =>
    httpFetchRequest(endpoint, { method: "GET", ...config }),

  post: (endpoint, body, config = {}) =>
    httpFetchRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...config,
    }),

  put: (endpoint, body, config = {}) =>
    httpFetchRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...config,
    }),

  patch: (endpoint, body, config = {}) =>
    httpFetchRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...config,
    }),

  delete: (endpoint, body, config = {}) =>
    httpFetchRequest(endpoint, {
      method: "DELETE",
      body: JSON.stringify(body),
      ...config,
    }),
};
