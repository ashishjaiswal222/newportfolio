import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Ashish Jaiswal - Cyberpunk Portfolio | Full Stack Developer",
  description = "Ashish Jaiswal - Full Stack Developer specialized in Java, React, Node.js. Cyberpunk-themed portfolio showcasing innovative projects and cutting-edge technology skills.",
  keywords = "Full Stack Developer, Java Developer, React Developer, Node.js, Portfolio, Software Engineer, Cyberpunk, Web Development",
  canonical,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData
}) => {
  const siteUrl = "https://ashishjaiswal.dev"; // Replace with your actual domain
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="Ashish Jaiswal Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@lovable_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead; 