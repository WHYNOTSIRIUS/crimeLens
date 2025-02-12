"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

interface FileWithPreview extends File {
  preview?: string;
}

export default function NewReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    division: "",
    district: "",
    crimeTime: "",
    description: "",
    isAnonymous: false,
  });
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...imageFiles]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview!);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (images.length === 0 && !video) {
      setError("Please provide at least one image or video");
      return;
    }

    try {
      setLoading(true);
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("division", formData.division);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("crimeTime", formData.crimeTime);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isAnonymous", String(formData.isAnonymous));

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      if (video) {
        formDataToSend.append("video", video);
      }

      const response = await fetch("/api/report", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast({
        title: "Report Submitted",
        description: "Your crime report has been submitted successfully.",
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Submit Crime Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Division</Label>
                <Select
                  value={formData.division}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, division: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                    <SelectItem value="chittagong">Chittagong</SelectItem>
                    <SelectItem value="rajshahi">Rajshahi</SelectItem>
                    {/* Add more divisions */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
                    <SelectItem value="gulshan">Gulshan</SelectItem>
                    <SelectItem value="mirpur">Mirpur</SelectItem>
                    {/* Add more districts */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crimeTime">When did this happen?</Label>
              <Input
                id="crimeTime"
                type="datetime-local"
                value={formData.crimeTime}
                onChange={(e) => setFormData(prev => ({ ...prev, crimeTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Images (Required)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={file.preview!}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {images.length < 4 && (
                  <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Video (Optional)</Label>
              {video ? (
                <div className="relative">
                  <video className="w-full rounded-lg" controls>
                    <source src={URL.createObjectURL(video)} />
                  </video>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={removeVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4">
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-sm">Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={5}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked }))}
              />
              <Label htmlFor="anonymous">Submit Anonymously</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 