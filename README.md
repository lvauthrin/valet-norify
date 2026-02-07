<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MVOA0vt47BNe-nkvoNzMfoWnmUUcAY8Z

## Run Locally

**Prerequisites:**  Node.js

1. Use nix shell
   `nix-shell -p nodejs`
1. Install dependencies:
   `npm install --registry https://registry.npmjs.org`
1. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
1. Run the app:
   `npm run dev`
1. Deploy the app to https://lvauthrin.github.io/valet-notify/:
   `npm run deploy`
