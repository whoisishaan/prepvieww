'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import Link from "next/link";
import { Mail, Phone, Linkedin, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactDropdownProps {
  className?: string;
}

export function ContactDropdown({ className }: ContactDropdownProps) {
  return (
    <Link href="/contact" className={cn(className)}>
      <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
    </Link>
  );
}
