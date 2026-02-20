"use server";

import { fetchAuth } from "@/lib/api/fetch-auth";

export interface Revenue {
    revenueId: number;
    description: string;
    profitAmount: number;
    commission: number;
}

export interface Project {
    projectId: number;
    projectName: string;
    commissionPercentage: number;
    revenues: Revenue[];
    totalProjectCommission: number;
}

export interface CommissionsResponse {
    projects: Project[];
    totalCommission: number;
}

export interface GetCommissionsResult {
    success?: boolean;
    data?: CommissionsResponse;
    error?: string;
}

export async function getCommissions(): Promise<GetCommissionsResult> {
    try {
        const response = await fetchAuth("/commissions", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: errorData.message || "Erro ao buscar comissões.",
            };
        }

        const data = await response.json();

        return {
            success: true,
            data,
        };
    } catch {
        return {
            error: "Erro de conexão. Verifique sua internet e tente novamente.",
        };
    }
}

// --- Commission Distribution ---

export interface ProjectDistribution {
    projectId: number;
    projectName: string;
    totalProjectCommission: number;
}

export interface CommissionDistributionResponse {
    projects: ProjectDistribution[];
    totalCommission: number;
}

export interface GetCommissionDistributionResult {
    success?: boolean;
    data?: CommissionDistributionResponse;
    error?: string;
}

export async function getCommissionDistribution(): Promise<GetCommissionDistributionResult> {
    try {
        const response = await fetchAuth("/commissions/distribution", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: errorData.message || "Erro ao buscar distribuição de comissões.",
            };
        }

        const data = await response.json();
        return { success: true, data };
    } catch {
        return {
            error: "Erro de conexão. Verifique sua internet e tente novamente.",
        };
    }
}

// --- User Profile ---

export interface UserProfile {
    id: number;
    email: string;
    fullName: string | null;
}

export interface GetMeResult {
    success?: boolean;
    data?: UserProfile;
    error?: string;
}

export async function getMe(): Promise<GetMeResult> {
    try {
        const response = await fetchAuth("/auth/me", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: errorData.message || "Erro ao buscar dados do usuário.",
            };
        }

        const data = await response.json();
        return { success: true, data };
    } catch {
        return {
            error: "Erro de conexão. Verifique sua internet e tente novamente.",
        };
    }
}
