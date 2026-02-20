"use server";

import { z } from "zod";
import { fetchAuth } from "@/lib/api/fetch-auth";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginActionResult = {
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function loginUser(
    prevState: LoginActionResult,
    formData: FormData
): Promise<LoginActionResult> {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const validatedFields = loginSchema.safeParse(rawData);

    if (!validatedFields.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const err of validatedFields.error.issues) {
            const field = err.path[0] as string;
            if (field) {
                if (!fieldErrors[field]) {
                    fieldErrors[field] = [];
                }
                fieldErrors[field].push(err.message);
            }
        }

        return {
            error: "Por favor, corrija os erros abaixo",
            fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const response = await fetchAuth("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: errorData.message || "Email ou senha incorretos.",
            };
        }

        const data = await response.json();
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        if (accessToken) {
            const cookieStore = await import("next/headers").then((mod) => mod.cookies());
            cookieStore.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 2,
            });
        }

        if (refreshToken) {
            const cookieStore = await import("next/headers").then((mod) => mod.cookies());
            cookieStore.set("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
            });
        }

        return { success: true };
    } catch {
        return {
            error: "Erro de conexão. Verifique sua internet e tente novamente.",
        };
    }
}
