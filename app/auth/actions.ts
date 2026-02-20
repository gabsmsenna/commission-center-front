"use server";

import { cookies } from "next/headers";
import { fetchAuth } from "@/lib/api/fetch-auth";
import { API_BASE_URL } from "@/lib/api/constants";

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    await fetchAuth("/auth/logout", { method: "POST" });
  } catch {
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  }
  
  return { success: true };
}

export async function refreshAccessToken(): Promise<{ 
  success: boolean; 
  error?: string;
  accessToken?: string;
  refreshToken?: string;
}> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return { success: false, error: "No refresh token" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return { success: false, error: "Refresh failed" };
    }

    const data = await response.json();
    
    cookieStore.set("accessToken", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
    });

    if (data.refresh_token) {
      cookieStore.set("refreshToken", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return { 
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch {
    return { success: false, error: "Connection error" };
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
