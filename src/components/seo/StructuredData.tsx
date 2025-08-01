import React from 'react';

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  image?: string;
  url: string;
  readTime?: string;
  category?: string;
  tags?: string[];
}

export const BlogPostingSchema: React.FC<BlogPostingSchemaProps> = ({
  title,
  description,
  author,
  publishedAt,
  modifiedAt,
  image,
  url,
  readTime,
  category,
  tags
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author,
      "url": "https://ashishjaiswal.dev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ashish Jaiswal Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ashishjaiswal.dev/logo.png"
      }
    },
    "datePublished": publishedAt,
    "dateModified": modifiedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "image": image ? {
      "@type": "ImageObject",
      "url": image
    } : undefined,
    "articleSection": category,
    "keywords": tags?.join(", "),
    "wordCount": description.length,
    "timeRequired": readTime
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  url: string;
  sameAs?: string[];
}

export const PersonSchema: React.FC<PersonSchemaProps> = ({
  name,
  jobTitle,
  description,
  image,
  url,
  sameAs = []
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "url": url,
    "image": image,
    "sameAs": sameAs
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}; 