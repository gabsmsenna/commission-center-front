"use client";

import { RevenueRegistrationForm } from "./revenue-registration-form";
import { Plus } from "lucide-react";
import { useState } from "react";

export function RevenueRegistrationButton({ projects }: { projects: { id: number; name: string }[] }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 transition-all ml-2"
            >
                <Plus className="w-[18px] h-[18px]" />
                Nova Receita de Projeto
            </button>
            <RevenueRegistrationForm
                open={open}
                onOpenChange={setOpen}
                projects={projects}
            />
        </>
    );
}
