// src/components/ui/ConfirmationDialog.tsx
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from './button';

interface ConfirmationDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode; // Este será o elemento que aciona o modal
}

export default function ConfirmationDialog({ title, description, onConfirm, children }: ConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button type="button" className="bg-gray-600 hover:bg-gray-500 text-white">
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onConfirm} className="bg-red-600 hover:bg-red-500 text-white">
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
