"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth.action";
import { LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label="User menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2">
        <Link href="/profile">
          <Button variant="ghost" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </Link>
        <form action={signOut}>
          <Button type="submit" variant="ghost" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border md:hidden z-50">
          <div className="py-1">
            <Link href="/profile">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                My Profile
              </button>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
