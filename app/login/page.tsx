import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Star, Mail, Lock, EyeOff, Eye } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="h-screen w-full flex overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
            {/* Left Side - Visual */}
            <div className="relative hidden lg:flex flex-1 flex-col justify-between p-12 bg-surface-card overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Modern skyscrapers looking up abstract perspective"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlD6Jo9u7Apfa1MRXLvRZIMyyph-o7I_xMj3r59ljrI3T2MPeP1uQoTs5fI9nmdIQyAeZ6Zfivqjnf6welQXrpCjEZc4V-R5VhUBwMpm3rcDAYkBivC0-TFvwemziukQ6IvAApemjxd0aO1g5niSuiTwN1TKbswLKuU89jBrWJeMnI5DKf2RA4IO1-6-Smit86IT-f83ZlM3EPYNwlmHQMxCJtPVeEN0QdO5Qp4wmZYrQ4RWDinLFCvy7QEwOtxhZbfqZsY_eAwI_S"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-surface-card/80 to-surface-card/60"></div>
                </div>

                {/* Content on top of image */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-white">
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-background-dark">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h2 className="text-white text-xl font-bold tracking-tight">
                            FreeLance Commission
                        </h2>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Controle suas finanças de freelancing com precisão.
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Junte-se outros freelancers que usam nosso painel para acompanhar lucros,
                        gerenciar comissões e prever o crescimento sem esforço.
                    </p>

                    <div className="flex gap-4 items-center">
                        
                    </div>
                </div>

                <div className="relative z-10 flex justify-between text-sm text-slate-400">
                    <p>© 2026 Freelance Commission Inc.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-background-light dark:bg-background-dark overflow-y-auto">
                {/* Mobile Header (Logo only) */}
                <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-background-dark">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">FreelanceOS</span>
                </div>

                <div className="w-full max-w-[420px] flex flex-col gap-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Bem-vindo de volta
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Insirar seus dados para realizar login.
                        </p>
                    </div>

                    <form className="flex flex-col gap-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10 py-6 bg-white dark:bg-surface-card border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Senha</Label>
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-10 pr-12 py-6 bg-white dark:bg-surface-card border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    <EyeOff className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        

                        {/* Submit Button */}
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-6 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(19,236,128,0.3)] hover:shadow-[0_0_20px_rgba(19,236,128,0.5)]"
                        >
                            Entrar
                        </Button>

                        {/* Social Login Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Ou continue com...
                            </span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
                            Ainda não tem uma conta?{" "}
                            <Link
                                href="#"
                                className="font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                Registrar-se de graça
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
