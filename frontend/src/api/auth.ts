import api from "./client";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.append("username", data.username);
  form.append("password", data.password);

  const response = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  return response.data; // { access_token, token_type }
}
