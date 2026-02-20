"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NumericFormat } from "react-number-format";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { createRevenueAction } from "@/app/dashboard/project-actions";
import { FolderOpen, DollarSign, CalendarIcon, FileText, Check } from "lucide-react";

const revenueSchema = z.object({
    projectId: z.string().min(1, "Selecione um projeto."),
    profitAmount: z
        .number({ message: "O valor é obrigatório." })
        .min(0.01, "O valor deve ser maior que zero."),
    revenueDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Data é obrigatória." }),
    description: z.string().min(1, "Descrição é obrigatória."),
});

type RevenueFormValues = z.infer<typeof revenueSchema>;

interface RevenueRegistrationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projects: { id: number; name: string }[];
}

export function RevenueRegistrationForm({ open, onOpenChange, projects }: RevenueRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const form = useForm<RevenueFormValues>({
        resolver: zodResolver(revenueSchema),
        defaultValues: {
            projectId: "",
            profitAmount: undefined,
            revenueDate: new Date(),
            description: "",
        },
    });

    const { register, handleSubmit, formState: { errors }, reset, control } = form;

    const onSubmit = async (data: RevenueFormValues) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const projectIdNum = parseInt(data.projectId, 10);
            const response = await createRevenueAction(projectIdNum, {
                profitAmount: data.profitAmount,
                revenueDate: data.revenueDate.toISOString(),
                description: data.description,
            });

            if (!response.success) {
                throw new Error(response.error || "Falha ao criar a receita.");
            }

            onOpenChange(false);
            reset();
        } catch (error: Error | unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError("Ocorreu um erro inesperado.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white dark:bg-[#162e22] border border-gray-200 dark:border-[#1f3d2f] text-slate-900 dark:text-slate-100 rounded-xl" aria-describedby="revenue-form-description">
                {/* Progress Indicator */}
                <div className="h-1 w-full bg-background-dark dark:bg-black/40">
                    <div className="h-full w-1/3 bg-primary rounded-r-full"></div>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8 h-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Nova Receita de Projeto
                        </DialogTitle>
                        <DialogDescription id="revenue-form-description" className="text-slate-500 dark:text-[#92c9ad] text-base">
                            Registre um novo pagamento ou marco de lucro para um projeto ativo.
                        </DialogDescription>
                    </div>

                    {submitError && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Project Selector — full width */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2" htmlFor="project-select">
                                    <FolderOpen className="w-[18px] h-[18px] text-primary" />
                                    Projeto
                                </label>
                                <div className="relative">
                                    <select
                                        {...register("projectId")}
                                        className="w-full h-14 pl-4 pr-10 bg-gray-50 dark:bg-[#102219] border border-gray-300 dark:border-[#1f3d2f] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white appearance-none transition-all cursor-pointer"
                                        id="project-select"
                                    >
                                        <option disabled value="">Escolha um projeto ativo...</option>
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-[#92c9ad]">▼</span>
                                </div>
                                {errors.projectId && <p className="text-red-500 text-xs">{errors.projectId.message}</p>}
                                <p className="text-xs text-slate-500 dark:text-[#92c9ad]">Selecione o projeto ao qual esta receita está associada.</p>
                            </div>

                            {/* Amount Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2" htmlFor="amount-input">
                                    <DollarSign className="w-[18px] h-[18px] text-primary" />
                                    Valor do Lucro
                                </label>
                                <Controller
                                    name="profitAmount"
                                    control={control}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <NumericFormat
                                            getInputRef={ref}
                                            value={value ?? ""}
                                            onValueChange={(values) => {
                                                onChange(values.floatValue);
                                            }}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale
                                            className="w-full h-14 pl-4 pr-4 bg-gray-50 dark:bg-[#102219] border border-gray-300 dark:border-[#1f3d2f] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9ad]/50 font-medium transition-all"
                                            id="amount-input"
                                            placeholder="R$ 0,00"
                                        />
                                    )}
                                />
                                {errors.profitAmount && <p className="text-red-500 text-xs">{errors.profitAmount.message}</p>}
                            </div>

                            {/* Date Picker — Shadcn Calendar */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <CalendarIcon className="w-[18px] h-[18px] text-primary" />
                                    Data do Recebimento
                                </label>
                                <Controller
                                    name="revenueDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="w-full h-14 px-4 flex items-center justify-between bg-gray-50 dark:bg-[#102219] border border-gray-300 dark:border-[#1f3d2f] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left font-medium text-slate-900 dark:text-white transition-all"
                                                >
                                                    <span className={field.value ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-[#92c9ad]/50"}>
                                                        {field.value
                                                            ? format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                                            : "Selecione uma data"}
                                                    </span>
                                                    <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-[#92c9ad]" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0 bg-white dark:bg-[#162e22] border border-gray-200 dark:border-[#1f3d2f] rounded-xl shadow-xl"
                                                align="start"
                                            >
                                                <CalendarUI
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setCalendarOpen(false);
                                                    }}
                                                    locale={ptBR}
                                                    className="rounded-xl"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.revenueDate && <p className="text-red-500 text-xs">{errors.revenueDate.message}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2" htmlFor="description-input">
                                <FileText className="w-[18px] h-[18px] text-primary" />
                                Título / Descrição
                            </label>
                            <textarea
                                {...register("description")}
                                className="w-full min-h-[120px] p-4 bg-gray-50 dark:bg-[#102219] border border-gray-300 dark:border-[#1f3d2f] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9ad]/50 font-normal transition-all resize-y"
                                id="description-input"
                                placeholder="Ex.: 50% do pagamento adiantado para entregáveis da fase 1"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gray-200 dark:bg-[#1f3d2f]"></div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                            <button
                                onClick={() => { reset(); onOpenChange(false); }}
                                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 dark:border-[#1f3d2f] text-slate-700 dark:text-[#92c9ad] font-bold hover:bg-gray-100 dark:hover:bg-[#102219] transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                type="button"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-background-dark font-extrabold shadow-[0_0_15px_rgba(19,236,128,0.3)] hover:shadow-[0_0_25px_rgba(19,236,128,0.5)] hover:bg-[#3bfba0] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>Salvando...</>
                                ) : (
                                    <>
                                        <Check className="w-[20px] h-[20px] bg-w" />
                                        Salvar Receita
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
