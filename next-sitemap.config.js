/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://globetrek.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
  },
  // Add dynamic routes when you have them
  // additionalPaths: async (config) => {
  //   return [
  //     await config.transform(config, '/flights/del-to-bom'),
  //   ]
  // },
};
