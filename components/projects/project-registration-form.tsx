"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Percent, Info, Check, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogContent,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { createProjectAction } from "@/app/dashboard/project-actions";

const projectSchema = z.object({
    name: z
        .string()
        .min(3, "O nome do projeto deve ter no mínimo 3 caracteres.")
        .max(100, "O nome do projeto deve ter no máximo 100 caracteres."),
    commissionPercentage: z.coerce
        .number()
        .min(0, "A comissão mínima é 0%.")
        .max(100, "A comissão máxima é 100%."),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectRegistrationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ProjectRegistrationForm({ open, onOpenChange, onSuccess }: ProjectRegistrationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<ProjectFormValues>({
        // @ts-expect-error Zod coercion strictness workaround
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            commissionPercentage: 0,
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = form;

    const onSubmit = async (data: ProjectFormValues) => {
        setIsLoading(true);
        setSubmitError(null);

        try {
            const response = await createProjectAction(data);

            if (!response.success) {
                throw new Error(response.error || "Falha ao criar o projeto.");
            }

            // Success
            reset();
            onOpenChange(false);
            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
        } catch (error: Error | unknown) {
            console.error("Error creating project:", error);
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError("Ocorreu um erro inesperado.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-[520px] [&>button]:hidden">
                <div className="relative w-full bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-8 pt-8 pb-4">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Registrar Novo Projeto
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 dark:text-emerald-200/60 font-display">
                                Insira os detalhes do seu próximo trabalho.
                            </DialogDescription>
                        </div>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="text-slate-400 hover:text-slate-600 dark:text-emerald-200/40 dark:hover:text-primary transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form Content */}
                    {/* @ts-expect-error form submission generic type mismatch due to z.coerce */}
                    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                        <div className="px-8 py-4 flex flex-col gap-6">

                            {/* General Error */}
                            {submitError && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg">
                                    {submitError}
                                </div>
                            )}

                            {/* Project Name Field */}
                            <div className="flex flex-col gap-2 group">
                                <label className="text-sm font-medium text-slate-700 dark:text-emerald-100" htmlFor="project-name">
                                    Nome do Projeto
                                </label>
                                <div className="relative">
                                    <input
                                        autoFocus
                                        id="project-name"
                                        placeholder="Ex: Redesign do Website"
                                        type="text"
                                        disabled={isLoading}
                                        className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#11221a] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                                        {...register("name")}
                                    />
                                </div>
                                {errors.name && (
                                    <span className="text-xs text-red-500">{errors.name.message}</span>
                                )}
                            </div>

                            {/* Commission Rate Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-emerald-100" htmlFor="commission">
                                    Taxa de Comissão
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        id="commission"
                                        placeholder="0"
                                        type="number"
                                        disabled={isLoading}
                                        className="w-full h-12 pl-4 pr-12 rounded-lg bg-slate-50 dark:bg-[#11221a] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
                                        {...register("commissionPercentage")}
                                    />
                                    <div className="absolute right-0 h-full flex items-center pr-4 pointer-events-none text-slate-400 dark:text-emerald-200/50">
                                        <Percent className="w-5 h-5" />
                                    </div>
                                </div>
                                {errors.commissionPercentage && (
                                    <span className="text-xs text-red-500">{errors.commissionPercentage.message}</span>
                                )}
                                {!errors.commissionPercentage && (
                                    <p className="text-xs text-slate-400 dark:text-emerald-200/40 mt-1">
                                        Taxa recomendada: 10-20% para projetos padrão.
                                    </p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-slate-100 dark:bg-border-dark/50 my-2"></div>

                            {/* Additional Info */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Info className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                                    Este projeto será adicionado à sua <span className="font-semibold text-slate-800 dark:text-white">Fila Ativa</span>. Você pode editar esses detalhes depois nas configurações.
                                </p>
                            </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="bg-slate-50 dark:bg-[#11221a]/50 px-8 py-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 border-t border-slate-100 dark:border-border-dark">
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="flex items-center justify-center px-6 h-11 rounded-lg text-sm font-semibold text-slate-600 dark:text-emerald-100 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-white/20 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center px-6 h-11 rounded-lg text-sm font-bold bg-primary text-[#102219] hover:bg-primary-hover active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(19,236,128,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#162e22] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">Salvar Projeto</span>
                                        <Check className="w-5 h-5 font-bold" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
