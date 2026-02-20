"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ProjectRegistrationForm } from "@/components/projects/project-registration-form";

export function ProjectRegistrationButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background-dark shadow-sm hover:bg-primary-dark transition-all"
            >
                <Plus className="w-[18px] h-[18px]" />
                Novo Projeto
            </button>
            <ProjectRegistrationForm
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}
