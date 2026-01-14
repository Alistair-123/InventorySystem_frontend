/**
 * ConfirmAction
 * -------------
 * A reusable confirmation dialog for critical actions (delete, edit, save, etc.).
 *
 * Purpose:
 * - Ask the user for confirmation before executing an action
 * - Be reusable anywhere in the application
 * - Stay UI-only (no business logic, no API calls)
 *
 * Usage:
 * - Controlled via `open`
 * - Parent provides `onConfirm` and `onCancel`
 */

import React from "react";
import { Button } from "@/components/ui/button";

export type ConfirmActionType = "delete" | "edit" | "confirm";

interface ConfirmActionProps {
  open: boolean;
  type: ConfirmActionType;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  open,
  type,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const isDelete = type === "delete";

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            variant={isDelete ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : confirmText ?? (isDelete ? "Delete" : "Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAction;
