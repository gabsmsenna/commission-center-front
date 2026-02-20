"use server";

import { z } from "zod";
import { fetchAuth } from "@/lib/api/fetch-auth";

const registerSchema = z.object({
    fullname: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.email("Email inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterActionResult = {
    success?: boolean;
    redirectTo?: string;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function registerUser(
    prevState: RegisterActionResult,
    formData: FormData
): Promise<RegisterActionResult> {
    const rawData = {
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm_password"),
        terms: formData.get("terms") === "on",
    };

    const validatedFields = registerSchema.safeParse(rawData);

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

    const { fullname, email, password } = validatedFields.data;

    try {
        const response = await fetchAuth("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                fullName: fullname,
                username: email.split("@")[0],
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: errorData.message || "Erro ao criar conta. Tente novamente.",
            };
        }

        const data = await response.json();

        if (data.accessToken) {
            const cookieStore = await import("next/headers").then((mod) => mod.cookies());
            cookieStore.set("accessToken", data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
            });
        }

        if (data.refreshToken) {
            const cookieStore = await import("next/headers").then((mod) => mod.cookies());
            cookieStore.set("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return { success: true, redirectTo: "/login" };
    } catch {
        return {
            error: "Erro de conexão. Verifique sua internet e tente novamente.",
        };
    }
}
