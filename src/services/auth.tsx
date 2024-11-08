export const login = async (username: string, password: string) => {
  const response = await fetch(
    "https://alt-dev.uniteframework.io/auth/realms/hasura-app/protocol/openid-connect/token",
    {
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
    }
  );

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const data = await response.json();

  return data;
};
