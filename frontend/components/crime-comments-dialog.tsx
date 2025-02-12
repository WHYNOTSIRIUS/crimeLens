"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { CrimeReport } from "@/lib/dummy-data";
import Image from "next/image";

interface CrimeCommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: CrimeReport;
}

export function CrimeCommentsDialog({ isOpen, onClose, report }: CrimeCommentsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full pr-4">
          <div className="space-y-4">
            {report.comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {comment.author.name}
                      {comment.author.verified && (
                        <span className="ml-1 inline-block">
                          <svg
                            viewBox="0 0 16 16"
                            className="h-4 w-4 fill-current text-blue-500"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </svg>
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
                <p className="text-sm">{comment.content}</p>
                {comment.proof && (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={comment.proof}
                      alt="Proof"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
