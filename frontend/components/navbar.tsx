"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { AlertCircle, LogIn, Menu, Search, Shield } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto gap-4">
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Shield className="h-6 w-6" />
          <span className="font-bold text-xl">CrimeSight</span>
        </Link>
        
        {/* Search Bar */}
        <div className="hidden md:flex relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-9" />
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/report" className="flex-shrink-0">
            <Button variant="destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              Report Crime
            </Button>
          </Link>
          
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Mobile Search */}
              <div className="px-2 py-2 md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search reports..." className="pl-9" />
                </div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}