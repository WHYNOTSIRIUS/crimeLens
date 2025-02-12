"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmergencyContact } from "@/lib/emergency-data";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Phone, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onReportOutdated: (contact: EmergencyContact) => void;
  isAuthenticated: boolean;
  onAuthRequired: (action: string) => void;
}

export function EmergencyDialog({
  isOpen,
  onClose,
  contacts,
  onReportOutdated,
  isAuthenticated,
  onAuthRequired,
}: EmergencyDialogProps) {
  const [reportedContacts, setReportedContacts] = useState<Set<string>>(new Set());

  const handleReportOutdated = (contact: EmergencyContact) => {
    if (!isAuthenticated) {
      onAuthRequired("report outdated emergency information");
      return;
    }
    
    if (!reportedContacts.has(contact.stationName)) {
      onReportOutdated(contact);
      setReportedContacts(new Set([...reportedContacts, contact.stationName]));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Emergency Contacts</DialogTitle>
          <DialogDescription>
            Contact the nearest police station for immediate assistance
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {contacts.map((contact) => (
            <div
              key={contact.stationName}
              className="grid gap-2 border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{contact.stationName}</h3>
                <Badge variant="outline">
                  Last verified:{" "}
                  {formatDistanceToNow(new Date(contact.lastVerified), {
                    addSuffix: true,
                  })}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{contact.address}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-wrap gap-2">
                  {contact.phoneNumbers.map((number) => (
                    <Button
                      key={number}
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${number}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {number}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleReportOutdated(contact)}
                  disabled={reportedContacts.has(contact.stationName)}
                  title={reportedContacts.has(contact.stationName) ? "Reported as outdated" : "Report outdated information"}
                >
                  <Flag className={cn(
                    "h-4 w-4",
                    reportedContacts.has(contact.stationName) 
                      ? "text-muted-foreground" 
                      : "text-destructive"
                  )} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
