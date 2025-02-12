"use client";

import { Button } from "@/components/ui/button";
import { ReportDialog } from "@/components/report-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { LogIn, LogOut, Menu, Search, Shield, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
          <ReportDialog
            trigger={
              <Button variant="destructive" className="flex-shrink-0">
                Report Crime
              </Button>
            }
          />
          
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                {isAuthenticated && user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Mobile Search */}
              <div className="px-2 py-2 md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search reports..." className="pl-9" />
                </div>
              </div>
              
              {isAuthenticated && user ? (
                <>
                  <div className="px-2 py-1.5">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}