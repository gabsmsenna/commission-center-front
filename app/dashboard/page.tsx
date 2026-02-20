import {
    LayoutDashboard,
    FolderOpen,
    PieChart,
    Users,
    Menu,
    Download,
    Wallet,
    DollarSign,
    Folder as FolderIcon,
    CornerDownRight
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { getCommissions, getCommissionDistribution, getMe } from "./dashboard-actions";
import { ProjectRegistrationButton } from "@/components/projects/project-registration-button";
import { RevenueRegistrationButton } from "@/components/projects/revenue-registration-button";
import { LogoutButton } from "@/components/ui/logout-button";

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

// Palette for chart segments (repeats if more projects than colors)
const CHART_COLORS = [
    "#13ec80",
    "#3b82f6",
    "#a855f7",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#f97316",
    "#84cc16",
];

export default function DashboardPageWrapper() {
    return <DashboardPage />;
}

async function DashboardPage() {
    const [result, distributionResult, meResult] = await Promise.all([
        getCommissions(),
        getCommissionDistribution(),
        getMe(),
    ]);

    const data = result.data;
    const error = result.error;

    if (error && process.env.NODE_ENV === "development") {
        console.warn("[DashboardPage] API Error:", error);
    }

    if (!data) {
        console.warn("[DashboardPage] No data received, falling back to DEMO_DATA");
    }

    const projects: import("./dashboard-actions").Project[] = data?.projects ?? [];
    const totalCommission = data?.totalCommission ?? 0;

    const totalProfit = projects.reduce((acc, project) => {
        return acc + project.revenues.reduce((sum, rev) => sum + rev.profitAmount, 0);
    }, 0);

    // Distribution chart data
    const distributionProjects: import("./dashboard-actions").ProjectDistribution[] = distributionResult.data?.projects ?? [];
    const distributionTotal = distributionResult.data?.totalCommission ?? 0;
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans antialiased">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-[#234836] dark:bg-[#11221a] md:flex">
                <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100 dark:border-[#234836]">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-background-dark font-bold text-lg">F</div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Freelance<span className="text-primary"> Commission</span></h1>
                </div>
                <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
                    <nav className="flex flex-col gap-2">
                        <Link href="#" className="flex items-center gap-3 rounded-lg bg-primary/20 px-4 py-3 text-sm font-medium text-primary dark:text-primary transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a3328] dark:hover:text-white transition-colors">
                            <FolderOpen className="w-5 h-5" />
                            Projetos
                        </Link>
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a3328] dark:hover:text-white transition-colors">
                            <PieChart className="w-5 h-5" />
                            Relatórios
                        </Link>
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a3328] dark:hover:text-white transition-colors">
                            <Users className="w-5 h-5" />
                            Clientes
                        </Link>
                    </nav>
                    <nav className="flex flex-col gap-2 border-t border-slate-100 pt-6 dark:border-[#234836]">
                        <LogoutButton />
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-[#234836]">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-[#1a3328]">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                            {/* Placeholder for user avatar */}
                            <div className="w-full h-full bg-gradient-to-tr from-primary to-blue-500"></div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                {meResult.data?.fullName || "Usuário Logado"}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {meResult.data?.email || "Email não encontrado"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-background-dark">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-[#234836] dark:bg-[#11221a] md:hidden">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Freelance<span className="text-primary">Sys</span></span>
                    <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">Visão Geral</h2>
                                <p className="text-slate-500 dark:text-[#92c9ad]">Bem-vindo de volta! Aqui está seu resumo financeiro.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-[#234836] dark:border-[#2e5c45] dark:text-white dark:hover:bg-[#2e5c45] transition-all">
                                    <Download className="w-[18px] h-[18px]" />
                                    Exportar
                                </button>
                                <ProjectRegistrationButton />
                                <RevenueRegistrationButton projects={projects.map(p => ({ id: p.projectId, name: p.projectName }))} />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Total Commission */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#234836] dark:bg-[#1a3328]">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-lg bg-primary/10 p-2 dark:bg-[#234836]">
                                        <Wallet className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-[#92c9ad]">Comissão Total</p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatCurrency(totalCommission)}</p>
                                </div>
                            </div>

                            {/* Total Profit */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#234836] dark:bg-[#1a3328]">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-lg bg-blue-500/10 p-2 dark:bg-[#234836]">
                                        <DollarSign className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-[#92c9ad]">Lucro Total</p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{formatCurrency(totalProfit)}</p>
                                </div>
                            </div>

                            {/* Active Projects */}
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#234836] dark:bg-[#1a3328]">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-lg bg-purple-500/10 p-2 dark:bg-[#234836]">
                                        <FolderIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-[#92c9ad]">Projetos Ativos</p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{projects.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Split */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Projects List & Detail (Left 2/3) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Detailed Breakdown Table */}
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#234836] dark:bg-[#1a3328] overflow-hidden">
                                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-[#234836]">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Projetos Ativos</h3>
                                        <Link href="#" className="text-sm font-medium text-primary hover:text-primary-dark">Ver todos</Link>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 text-slate-500 dark:bg-[#11221a] dark:text-slate-400">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Nome do Projeto</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium text-right">Taxa de Comissão</th>
                                                    <th className="px-6 py-3 font-medium text-right">Lucro Total</th>
                                                    <th className="px-6 py-3 font-medium text-right">Comissão</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-[#234836]">
                                                {projects.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                                            Nenhum projeto encontrado
                                                        </td>
                                                    </tr>
                                                )}
                                                {projects.map((project) => (
                                                    <React.Fragment key={project.projectId}>
                                                        <tr className="group hover:bg-slate-50 dark:hover:bg-[#234836]/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                                        {project.projectName.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="font-medium text-slate-900 dark:text-white">{project.projectName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                                    Ativo
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300">{project.commissionPercentage}%</td>
                                                            <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                                                                {formatCurrency(project.revenues.reduce((sum, rev) => sum + rev.profitAmount, 0))}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-bold text-primary">{formatCurrency(project.totalProjectCommission)}</td>
                                                        </tr>
                                                        {project.revenues.length > 0 && (
                                                            <React.Fragment key={`${project.projectId}-revenues`}>
                                                                <tr className="bg-slate-50/50 dark:bg-[#152a20]">
                                                                    <td className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92c9ad]" colSpan={5}>
                                                                        Detalhamento de Receita
                                                                    </td>
                                                                </tr>
                                                                {project.revenues.map((revenue) => (
                                                                    <tr key={revenue.revenueId} className="bg-slate-50/50 dark:bg-[#152a20] border-t border-slate-100 dark:border-[#234836]">
                                                                        <td className="px-6 py-3 pl-10 text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                                            <CornerDownRight className="w-4 h-4 text-slate-400" />
                                                                            {revenue.description}
                                                                        </td>
                                                                        <td className="px-6 py-3"></td>
                                                                        <td className="px-6 py-3 text-right text-xs text-slate-500 dark:text-slate-400">{project.commissionPercentage}% aplicado</td>
                                                                        <td className="px-6 py-3 text-right text-slate-600 dark:text-slate-300">{formatCurrency(revenue.profitAmount)}</td>
                                                                        <td className="px-6 py-3 text-right text-primary">{formatCurrency(revenue.commission)}</td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Charts & Activity (1/3) */}
                            <div className="space-y-6">
                                {/* Distribution Chart */}
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#234836] dark:bg-[#1a3328]">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Distribuição</h3>

                                    {distributionProjects.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
                                            <PieChart className="w-12 h-12 mb-3 opacity-40" />
                                            <p className="text-sm">Sem dados de comissão</p>
                                        </div>
                                    ) : (() => {
                                        // Build conic-gradient segments
                                        let accumulated = 0;
                                        const segments = distributionProjects.map((p, i) => {
                                            const pct = distributionTotal > 0
                                                ? (p.totalProjectCommission / distributionTotal) * 100
                                                : 100 / distributionProjects.length;
                                            const color = CHART_COLORS[i % CHART_COLORS.length];
                                            const start = accumulated;
                                            accumulated += pct;
                                            return { ...p, pct, color, start };
                                        });
                                        const gradient = segments
                                            .map(s => `${s.color} ${s.start.toFixed(2)}% ${(s.start + s.pct).toFixed(2)}%`)
                                            .join(", ");

                                        return (
                                            <>
                                                <div className="relative flex items-center justify-center p-4">
                                                    <div
                                                        className="relative h-48 w-48 rounded-full"
                                                        style={{ background: `conic-gradient(${gradient})` }}
                                                    >
                                                        <div className="absolute inset-2 rounded-full bg-white dark:bg-[#1a3328] flex flex-col items-center justify-center">
                                                            <span className="text-xs font-medium text-slate-500 dark:text-[#92c9ad]">Valor Total</span>
                                                            <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight text-center px-1">{formatCurrency(distributionTotal)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 space-y-3">
                                                    {segments.map((s) => (
                                                        <div key={s.projectId} className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: s.color }}></div>
                                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                                                                    {s.projectName}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                                                                {formatCurrency(s.totalProjectCommission)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}