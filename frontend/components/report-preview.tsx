"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { MapPin, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReportPreviewProps {
  report: {
    id: string;
    title: string;
    description: string;
    location: {
      division: string;
      district: string;
    };
    timestamp: Date;
    images: string[];
    video?: string;
    author?: {
      name: string;
      avatar?: string;
    };
    isAnonymous?: boolean;
  };
}

export function ReportPreview({ report }: ReportPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {report.video ? (
            <video
              src={report.video}
              className="object-cover w-full"
              controls
            />
          ) : (
            <Image
              src={report.images[0]}
              alt={report.title}
              fill
              className="object-cover"
            />
          )}
        </AspectRatio>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {report.location.division}, {report.location.district}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(report.timestamp, { addSuffix: true })}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {report.description}
        </p>
        {!report.isAnonymous && report.author && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {report.author.avatar ? (
              <Image
                src={report.author.avatar}
                alt={report.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span>{report.author.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 