import { CrimeCard } from "@/components/crime-card";
import { dummyCrimeReports } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Recent Crime Reports</h1>
        <p className="text-muted-foreground">
          Stay informed about incidents in your area and help verify reports
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-card rounded-lg p-4 mb-8 space-y-4">
        {/* Quick Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Clock className="mr-2 h-4 w-4" />
            Most Recent
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <TrendingUp className="mr-2 h-4 w-4" />
            Most Upvoted
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verified Only
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Last 24 Hours</DropdownMenuItem>
              <DropdownMenuItem>Last Week</DropdownMenuItem>
              <DropdownMenuItem>Last Month</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>High Priority</DropdownMenuItem>
              <DropdownMenuItem>With Video Evidence</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Location Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="chittagong">Chittagong</SelectItem>
                <SelectItem value="rajshahi">Rajshahi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
                <SelectItem value="gulshan">Gulshan</SelectItem>
                <SelectItem value="mirpur">Mirpur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="verified">Most Verified</SelectItem>
                <SelectItem value="upvotes">Most Upvotes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {dummyCrimeReports.map((report) => (
          <CrimeCard key={report.id} report={report} />
        ))}
        
        <div className="flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  );
}