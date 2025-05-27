"use client";

// CHANGE


import { Mail, Phone, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const contactInfo = [
    {
      type: "email",
      value: "ishaansharma1006@gmail.com",
      icon: <Mail className="h-4 w-4 mr-2" />,
      label: "Email",
      isLink: false
    },
    {
      type: "phone",
      value: "+91 6396586968",
      icon: <Phone className="h-4 w-4 mr-2" />,
      label: "Phone",
      isLink: false
    },
    {
      type: "linkedin",
      value: "https://www.linkedin.com/in/ishaan-sharma-a43547202/",
      icon: <Linkedin className="h-4 w-4 mr-2" />,
      label: "LinkedIn",
      isLink: true
    }
  ];

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [type]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Contact Information</h1>
      <div className="space-y-4">
        {contactInfo.map(({ type, value, icon, label, isLink }) => (
          <div key={type} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icon}
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {value}
                  </div>
                </div>
              </div>
              {isLink ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Open
                </a>
              ) : (
                <button
                  onClick={() => handleCopy(value, type)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 outline-none"
                >
                  {copied[type] ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
