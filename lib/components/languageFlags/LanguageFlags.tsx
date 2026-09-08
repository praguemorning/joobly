import Image from "next/image";
import {
	getLanguageFlagCode,
	parseJobLanguages,
} from "@/lib/constant/languageFlags";

interface LanguageFlagsProps {
	language?: string;
	size?: "sm" | "md";
	showLabel?: boolean;
}

const SIZE = {
	sm: { width: 20, height: 15, src: "20x15" },
	md: { width: 24, height: 18, src: "24x18" },
} as const;

const LanguageFlags = ({
	language,
	size = "sm",
	showLabel = false,
}: LanguageFlagsProps) => {
	const languages = parseJobLanguages(language);
	if (languages.length === 0) return null;

	const { width, height, src } = SIZE[size];

	return (
		<div
			className="inline-flex items-center gap-1.5 flex-wrap"
			aria-label={`Job languages: ${languages.join(", ")}`}
		>
			{languages.map((lang) => {
				const code = getLanguageFlagCode(lang);

				return (
					<span
						key={lang}
						className="inline-flex items-center gap-1"
						title={lang}
					>
						{code ? (
							<Image
								src={`https://flagcdn.com/${src}/${code}.png`}
								alt={`${lang} flag`}
								width={width}
								height={height}
								className="rounded-sm border border-gray-200 object-cover"
							/>
						) : (
							<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								{lang.slice(0, 3)}
							</span>
						)}
						{showLabel && (
							<span className="text-sm text-gray-600">{lang}</span>
						)}
					</span>
				);
			})}
		</div>
	);
};

export default LanguageFlags;
