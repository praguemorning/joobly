import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./lib/components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			screens: {
				xs: "320px",
				sm: "375px",
				sml: "500px",
				md: "667px",
				mdl: "768px",
				lg: "960px",
				lgl: "1024px",
				xl: "1280px",
				"2x1": "1400px",
			  },
			colors: {
				primary: {
					DEFAULT: "#cc0303",
					dark: "#a80202",
				},
				secondary: {
					DEFAULT: "#cc0303",
					light: "#cc030326",
				},
				geryButtonTex: "#848fac",
				required: "#e04f33",
				dark: "#171821",
				grey: {
					dark: "#4a4a4a",
					medium: "#7f879e",
					light: {
						DEFAULT: "#f3f3f3",
						helpIcon: "#bdc3c3",
					},
				},
				baseBlack50: "#54555e",
				light: "#fff",
				greyButtonBorder: "#dfe8f6",
				inputBg: "#f6f8f9",
				borderGradient: "#cc0303",
				linearGradient: "#e5ebf5",
			},
		},
	},
	plugins: [],
};
export default config;
