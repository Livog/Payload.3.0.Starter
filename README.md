# 🚀 Next.js 14.2 + Payload 3.0 Boilerplate 🎉

This boilerplate uses:

- 🌐 [Next.js 14.2](https://github.com/vercel/next.js)
- 📦 [Payload 3.0](https://github.com/payloadcms/payload)
- 🔐 [NextAuth.js v5](https://github.com/nextauthjs/next-auth) with a custom-built Payload Adapter
- 🎨 [Tailwind CSS 3.4](https://github.com/tailwindlabs/tailwindcss)
- ✨ [Prettier](https://github.com/prettier/prettier)
- 📝 Lexical Component (RSC) (Not HTML Saved 🤩)
- 🖼️ Import SVG as React Component (SVGR)
- 📧 [Email with Resend](https://resend.com)
- 📦 [S3/Cloudflare R2 Cloud Storage](https://github.com/payloadcms/plugin-cloud-storage)
- 🧩 [shadcn/ui](https://ui.shadcn.com/docs)

## About

Hello!

This repository is my experimental playground for integrating Payload 3.0 with Next.js, aimed at crafting a boilerplate useful for launching SaaS projects. My primary focus is on owning the data we collect and maintaining control over the code we develop. Although I'm passionate about RSC and capable of creating low JS RSC components, I prioritized the project structure and functionality, which led me to choose shadcn/ui.

Please note, this setup includes several components in their nascent stages:

- Next.js is running on canary.
- Payload is currently in beta.
- NextAuth v5 is also in beta.

This is not yet a production-ready environment, but with Payload 3.0 introducing significant updates, I'm eager to leverage these as soon as the packages stabilize.

I've tried to demonstrate solutions for common challenges observed in the community:

- **Authentication**: Using Payload's new auth strategy and keeping a separation between the Payload admin UI and user UI ensures that admins maintain control while users enjoy a tailored SaaS experience.
- **Lexical Component**: Instead of using a traditional "HTML" field, it utilizes RSC-style rendering, simular to how `mdx-components.tsx` works in MDX, which maintains control on the HTML and styling.
- **Query by Path**: I think this is the most logical and easiest way to integrate dynamic querying against Payload using only one `page.tsx`. This also makes more sense for the Lexical Component.

This project is still a work in progress, so your patience and feedback are appreciated. I'm just an enthusiast of what Payload solves and truly believe in the CMS as a formidable challenger to Wordpress.

I'm always open to providing support, so feel free to reach out to me on Discord if you have questions or need assistance.
