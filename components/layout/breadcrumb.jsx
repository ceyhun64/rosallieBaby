"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function capitalizeWords(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-xs sm:text-sm breadcrumbs mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-white hover:text-white/90">
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2 text-white">/</span>
              {isLast ? (
                <span className="text-white/80 font-semibold">
                  {capitalizeWords(segment)}
                </span>
              ) : (
                <Link href={href} className="text-white/70 hover:text-white/50">
                  {capitalizeWords(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
