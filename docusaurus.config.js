module.exports = {
  title: "Plataforma 5 - Coding Bootcamp",
  tagline: "Technical guide",
  url: "https://P5devteam.github.io",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "P5devteam",
  projectName: "docs",
  themeConfig: {
    navbar: {
      logo: {
        alt: "Plataforma 5 - Coding Bootcamp",
        src: "img/favicon.ico"
      },
      links: [
        { to: "docs/intro", label: "Docs", position: "left" },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/plataforma5la/docs",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Way of Work",
          items: [
            {
              label: "Style Guide",
              to: "docs/intro"
            }
          ]
        },
        {
          title: "Contact",
          items: [
            {
              label: "Slack",
              href: "https://plataforma5.slack.com/messages"
            },
            {
              label: "Landing",
              href: "https://plataforma5.la"
            }
          ]
        },
        {
          title: "Services",
          items: [
            {
              label: "Github",
              to: "https://github.com/P5devteam"
            },
            {
              label: "AWS",
              href: "https://aws.amazon.com"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Plataforma 5 - Coding Bootcamp, Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/facebook/docusaurus/edit/master/website/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};
