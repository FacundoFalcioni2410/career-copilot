"use client";

import { useState } from "react";
import NavLinks from "@/components/layout/NavLinks";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <span className="text-base font-semibold text-gray-900">
          Career Copilot
        </span>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <NavLinks onNavigate={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
