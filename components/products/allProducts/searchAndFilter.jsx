"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

export default function SearchAndFilter() {
  const categories = [
    { name: "Muslin", count: 28 },
    { name: "Sleep Buddy", count: 5 },
  ];

  return (
    <div className="w-full max-w-xs space-y-4">
      {/* Search input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="What are you looking for?"
          className="w-full pl-10 pr-3 py-2 h-10"
        />
      </div>

      {/* Accordion for subcategories */}
      <Accordion type="single" collapsible defaultValue="sub-categories">
        <AccordionItem value="sub-categories">
          <AccordionTrigger className="flex justify-between items-center text-lg font-semibold">
            Subcategories
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-sm text-gray-700">
              {categories.map((category) => (
                <li key={category.name}>
                  <a href="#" className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="text-gray-500">({category.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
