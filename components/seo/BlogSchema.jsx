"use client";

import React from "react";

// Blog Article Schema
export default function BlogSchema({
    title,
    description,
    slug,
    image,
    datePublished,
    dateModified,
}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: description,
        image: image ? `https://rosalliebaby.com${image}` : undefined,
        author: {
            "@type": "Organization",
            name: "Rosallie Baby Editorial Team",
            url: "https://rosalliebaby.com",
        },
        publisher: {
            "@type": "Organization",
            name: "Rosallie Baby",
            logo: {
                "@type": "ImageObject",
                url: "https://rosalliebaby.com/logo/logo2.webp",
            },
        },
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://rosalliebaby.com/blog/${slug}`,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// FAQ Schema for Featured Snippets
export function FAQSchema({ questions }) {
    if (!questions || questions.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: q.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
