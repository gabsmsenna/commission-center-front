"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
    LineChart,
    BarChart3,
    Calculator,
    User,
    Mail,
    Lock,
    CheckCircle2,
} from "lucide-react";
import { registerUser, RegisterActionResult } from "./actions";

const initialState: RegisterActionResult = {};

export default function RegisterPage() {
    const router = useRouter();
    const [state, formAction] = useActionState(registerUser, initialState);

    if (state.success) {
        router.push(state.redirectTo || "/login");
        router.refresh();
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#234836] px-6 lg:px-10 py-4 bg-white dark:bg-[#11221a]">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="size-8 flex items-center justify-center rounded bg-primary/20 text-primary">
                        <LineChart className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">ProfitManager</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block text-sm text-slate-600 dark:text-[#92c9ad]">Já tem uma conta?</span>
                    <Link href="/login">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 dark:bg-[#193326] text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-[#234836] transition-colors border border-transparent dark:border-[#32674d]">
                            <span className="truncate">Entrar</span>
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="hidden lg:flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                                Transforme o caos do seu <span className="text-primary">freelance</span> em clareza.
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-[#92c9ad] leading-relaxed max-w-md">
                                Junte-se a milhares de freelancers que usam o ProfitManager para calcular ganhos reais, rastrear despesas e prever crescimento.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-[#193326] border border-slate-200 dark:border-[#32674d] shadow-sm">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Análise Visual</h3>
                                    <p className="text-sm text-slate-500 dark:text-[#92c9ad] mt-1">Veja suas tendências mensais num piscar de olhos.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-[#193326] border border-slate-200 dark:border-[#32674d] shadow-sm">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Calculator className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Calculadora Inteligente</h3>
                                    <p className="text-sm text-slate-500 dark:text-[#92c9ad] mt-1">Estimativas instantâneas de lucro líquido.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto lg:ml-auto">
                        <div className="bg-white dark:bg-[#11221a] rounded-2xl shadow-xl dark:shadow-[0_0_0_1px_rgba(50,103,77,0.5)] p-6 sm:p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Crie sua conta</h2>
                                <p className="text-slate-600 dark:text-[#92c9ad]">Comece a gerenciar suas comissões hoje.</p>
                            </div>

                            {state.error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                                </div>
                            )}

                            <form action={formAction} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="fullname">Nome Completo</label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-lg border border-slate-200 dark:border-[#32674d] bg-slate-50 dark:bg-[#193326] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9ad]/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none"
                                            id="fullname"
                                            name="fullname"
                                            placeholder="ex. Gabriel Senna"
                                            type="text"
                                        />
                                        <div className="absolute right-3 top-3 text-slate-400 dark:text-[#32674d]">
                                            <User className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {state.fieldErrors?.fullname && (
                                        <p className="text-xs text-red-500 mt-1">{state.fieldErrors.fullname[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">Endereço de Email</label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-lg border border-slate-200 dark:border-[#32674d] bg-slate-50 dark:bg-[#193326] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9ad]/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none"
                                            id="email"
                                            name="email"
                                            placeholder="nome@empresa.com"
                                            type="email"
                                        />
                                        <div className="absolute right-3 top-3 text-slate-400 dark:text-[#32674d]">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {state.fieldErrors?.email && (
                                        <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">Senha</label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-lg border border-slate-200 dark:border-[#32674d] bg-slate-50 dark:bg-[#193326] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9ad]/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none"
                                            id="password"
                                            name="password"
                                            placeholder="Crie uma senha"
                                            type="password"
                                        />
                                        <div className="absolute right-3 top-3 text-slate-400 dark:text-[#32674d]">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {state.fieldErrors?.password && (
                                        <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="confirm_password">Confirmar Senha</label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-lg border border-slate-200 dark:border-[#32674d] bg-slate-50 dark:bg-[#193326] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9ad]/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none"
                                            id="confirm_password"
                                            name="confirm_password"
                                            placeholder="Repita a senha"
                                            type="password"
                                        />
                                        <div className="absolute right-3 top-3 text-slate-400 dark:text-[#32674d]">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {state.fieldErrors?.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">{state.fieldErrors.confirmPassword[0]}</p>
                                    )}
                                </div>
                                {state.fieldErrors?.terms && (
                                    <p className="text-xs text-red-500 mt-1">{state.fieldErrors.terms[0]}</p>
                                )}

                                <button
                                    className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-[#11221a] text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity"
                                    type="submit"
                                >
                                    <span className="truncate">Criar Conta</span>
                                </button>
                            </form>

                            <div className="mt-6 text-center lg:hidden">
                                <p className="text-sm text-slate-600 dark:text-[#92c9ad]">
                                    Já tem uma conta? <Link href="/login" className="text-primary font-bold hover:underline">Entrar</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
