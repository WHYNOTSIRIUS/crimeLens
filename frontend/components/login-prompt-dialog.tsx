"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LoginPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function LoginPromptDialog({ isOpen, onClose, message = "Please log in to continue" }: LoginPromptDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>
            Log in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
