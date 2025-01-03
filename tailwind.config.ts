import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'custom-calc': 'calc(100% - 120px)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'UI-Color-Indigo-200': '#8B80F9',
        'UI-Color-Neutral-100': '#FFFEFC',
      },
      backgroundImage: {
        'hb-pattern': "url('/hb_pattern.png')",
        'hb-pattern-mobile': "url('/hb_pattern_mobile.svg')",
        'copy': "url('/copy.svg')",
        'ul-1': "url('/ul_1.svg')",
        'ul-2': "url('/ul_2.svg')",
        'ul-3': "url('/ul_3.svg')",
        'back': "url('/back.svg')",
      }
    },
  },
  plugins: [nextui()],
};
export default config;
