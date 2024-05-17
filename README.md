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
- 📦 [S3/Cloudflare R2 Cloud Storage](https://github.com/payloadcms/payload/tree/main/packages/plugin-cloud-storage)
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

# Installation Guide

## Prerequisites

Ensure you have `pnpm` installed. If not, install it using:

```sh
npm install -g pnpm
```

## Steps

1. **Install Dependencies**:

   ```sh
   pnpm install
   ```

2. **Environment Variables**:

   - Make a copy of `.env.example` and rename it to `.env`:
     ```sh
     cp .env.example .env
     ```

3. **Fill in the `.env` file**:

   ### General Settings

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   ### MongoDB URI

   - Set up a MongoDB instance. For simplicity, you can use [Railway](https://railway.app?referralCode=2zFUkU).
   - Get the MongoDB URI and fill in:
     ```env
     MONGODB_URI=<your_mongodb_uri>
     ```

   ### Authentication

   - Generate a secret via CLI:
     ```sh
     openssl rand -base64 32
     ```
   - This will give you:
     ```env
     AUTH_SECRET=<your_generated_secret>
     ```
   - Fill in the following:
     ```env
     AUTH_TRUST_HOST=true
     AUTH_VERPOSE=false
     AUTH_URL=http://localhost:3000
     ```

   ### GitHub OAuth

   - Create a GitHub OAuth application [here](https://github.com/settings/developers).
   - Fill in:
     ```env
     AUTH_GITHUB_ID=<your_github_client_id>
     AUTH_GITHUB_SECRET=<your_github_client_secret>
     ```

   ### Cloudflare (CDN Purging)

   - Go here [here](https://dash.cloudflare.com/). Click on your website, scroll down to Zone ID, copy and paste that.
   - Click on "Get your API Token" -> Create token -> Create Custom Token -> Permissions: Zone" | "Cache Purge" | Purge. Click save and copy paste the token.
   - Fill in:
     ```env
     CLOUDFLARE_API_TOKEN=
     CLOUDFLARE_ZONE_ID=
     ```

   ### Resend (Email)

   - Sign up for Resend and get your API key [here](https://resend.com).
   - Fill in:
     ```env
     RESEND_DEFAULT_EMAIL=<your_default_email>
     AUTH_RESEND_KEY=<your_resend_api_key>
     ```

   ### Cloudflare R2 (S3)

   - Sign up for Cloudflare R2 and get your credentials [here](https://dash.cloudflare.com).
   - Go to [Cloudflare R2 Overview]. The url is usually like: https://dash.cloudflare.com/{accountIdHere}/r2/overview
   - Click on "Create Bucket" and save all credentials.
   - After creating the bucket, return to the overview screen and click "Manage R2 API Tokens".
   - If you don't have an API key, click "Create API Key". You should now have an `ACCESS_KEY_ID` and a `SECRET_ACCESS_KEY`.
   - The region is usually `auto` for R2.
   - Your `S3_ENDPOINT` is typically structured like this in Cloudflare:
     ```
     https://{accountId}.r2.cloudflarestorage.com/{bucketNameInLowerCaseAndKebabCase}
     ```
   - The `NEXT_PUBLIC_S3_HOSTNAME` should be the public hostname (e.g. my-bucket.example.com) for your bucket to enable caching and reduce B operations.

   - Fill in:
     ```env
     S3_ACCESS_KEY_ID=<your_access_key_id>
     S3_SECRET_ACCESS_KEY=<your_secret_access_key>
     S3_REGION=auto
     S3_ENDPOINT=https://{accountId}.r2.cloudflarestorage.com
     S3_BUCKET=<your_s3_bucket>
     NEXT_PUBLIC_S3_HOSTNAME=<your_s3_hostname>
     ```

## Optional Services

If any of the sections above are not set, you need to comment out the respective code using these services.

## Deployment

### Railway.app

- Create your project on [Railway](https://railway.app?referralCode=2zFUkU).
- Add your MongoDB instance.
- Add the Git repository as a new service.
- Ensure that you also fill in the environment variables in the Railway interface.

Any `localhost:3000` domains in your local `.env` file should be replaced with production URLs in your Railway Variables section.

### Note:

- Ensure to comment out code sections that rely on any of the above environment variables if they are not set.
