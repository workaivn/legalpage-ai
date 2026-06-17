import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px rgba(20, 28, 48, 0.08)",
      },
    },
  },
  plugins: [forms],
};

export default config;
