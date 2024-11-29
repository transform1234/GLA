import URL from "../../utils/constants/url-constants.json";

export const fetchToken = async (username: string, password: string) => {
  const authUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.AUTH}`;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: "hasura-app",
      username,
      password,
      grant_type: "password",
      client_secret: "9ca6e96d-f72e-4208-91f4-a2d8e681f767",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch token");
  }

  const data = await response.json();
  return data;
};

export const getAuthUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not available in localStorage");
  }

  const userUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.USER}`;

  const response = await fetch(userUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};
export const checkUserDetails = async () => {
  try {
    const userUrl = `${import.meta.env.VITE_API_AUTH_URL}${URL.USER_VALIDATION}`;
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'No token' };
    }

    const response = await fetch(userUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, status: 'Unauthorized', message: 'Unauthorized access' };
      } else {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
