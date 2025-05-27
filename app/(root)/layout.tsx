import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { ContactDropdown } from "@/components/ContactDropdown";
import { UserMenu } from "@/components/UserMenu";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="w-full border-b">
        <div className="flex flex-wrap items-center justify-between p-4 mx-auto max-w-7xl">
          {/* Logo and brand */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="MockMate Logo" width={38} height={32} />
              <h2 className="text-primary-100 whitespace-nowrap">PrepView</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <ContactDropdown />
            <a href="https://thejobhunter.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="whitespace-nowrap">Apply for jobs</Button>
            </a>
            <Link href="/about">
              <Button variant="ghost">About Us</Button>
            </Link>
            <UserMenu />
          </div>

          {/* Mobile menu button - only shows on small screens */}
          <div className="flex items-center md:hidden space-x-2">
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navigation - shows below on small screens */}
        <div className="md:hidden bg-background border-t">
          <div className="px-4 py-2 space-y-1">
            <ContactDropdown className="w-full justify-start" />
            <a href="https://thejobhunter.vercel.app/" target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="ghost" className="w-full justify-start">Apply for jobs</Button>
            </a>
            <Link href="/about" className="block w-full">
              <Button variant="ghost" className="w-full justify-start">About Us</Button>
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;