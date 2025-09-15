"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function capitalizeWords(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm breadcrumbs mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-700 font-semibold">
                  {capitalizeWords(segment)}
                </span>
              ) : (
                <Link href={href} className="text-gray-500 hover:text-gray-700">
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
