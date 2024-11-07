export const REACT_APP_OAUTH_PROXY_ENABLED = false;
export const REACT_APP_API_URL = "https://alt-dev.uniteframework.io/api/v1";
export const REACT_APP_BASE_URL = "https://alt-dev.uniteframework.io";
export const REACT_APP_SECRET_KEY = "9ca6e96d-f72e-4208-91f4-a2d8e681f767";

let baseUrl = REACT_APP_API_URL;

export const getOne = async ({ id, adapter, type }, header = {}) => {
  let headers = new Headers({
    ...header,
    Authorization: "Bearer " + sessionStorage.getItem("token"),
  });

  try {
    const response = await fetch(
      `${baseUrl}/course/${adapter}/hierarchy/contentid?courseId=${id}&type=${type}`,
      {
        method: "GET",
        // credentials: "include", // This ensures that credentials (cookies, etc.) are sent with the request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result?.data || {};
    } else {
      console.log("Failed to fetch data");
      return {};
    }
  } catch (e) {
    console.log("course/hierarchy/contentid", e.message);
    return {};
  }
};
