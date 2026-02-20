"use server";

import { fetchAuth } from "@/lib/api/fetch-auth";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: { name: string; commissionPercentage: number }) {
    try {
        const response = await fetchAuth("/projects", {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.message || "Falha ao criar o projeto.",
            };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: Error | unknown) {
        console.error("Error in createProjectAction:", error);
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }
        return {
            success: false,
            error: "Ocorreu um erro inesperado.",
        };
    }
}

export async function createRevenueAction(
    projectId: number,
    data: { profitAmount: number; revenueDate: string; description: string }
) {
    try {
        const response = await fetchAuth(`/projects/${projectId}/revenues`, {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.message || "Falha ao criar a receita.",
            };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: Error | unknown) {
        console.error("Error in createRevenueAction:", error);
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }
        return {
            success: false,
            error: "Ocorreu um erro inesperado.",
        };
    }
}
