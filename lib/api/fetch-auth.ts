import { API_BASE_URL } from "./constants";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/app/auth/actions";
import { redirect } from "next/navigation";

export async function fetchAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshResult = await refreshAccessToken();

    if (refreshResult.success) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${refreshResult.accessToken}`;
      response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        redirect("/login");
      }
    } else {
      redirect("/login");
    }
  }

  return response;
}
