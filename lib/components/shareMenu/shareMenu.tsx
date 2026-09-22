"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./shareMenu.module.scss";

interface ShareMenuProps {
	url: string;
	title: string;
}

const ICONS: Record<string, string> = {
	link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
	whatsapp:
		"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
	linkedin:
		"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
	email:
		"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
	facebook:
		"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
	share:
		"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z",
};

const ShareMenu: React.FC<ShareMenuProps> = ({ url, title }) => {
	const [open, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const wrapper = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e: MouseEvent) => {
			if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
		};
		const onEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDocClick);
		document.addEventListener("keydown", onEscape);
		return () => {
			document.removeEventListener("mousedown", onDocClick);
			document.removeEventListener("keydown", onEscape);
		};
	}, [open]);

	const encoded = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	const links = [
		{ key: "whatsapp", label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}` },
		{ key: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}` },
		{ key: "email", label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encoded}` },
		{ key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
	];

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			const field = document.createElement("textarea");
			field.value = url;
			field.style.position = "fixed";
			field.style.opacity = "0";
			document.body.appendChild(field);
			field.select();
			document.execCommand("copy");
			document.body.removeChild(field);
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={styles["share-menu"]} ref={wrapper}>
			<button
				type="button"
				className={styles["share-menu__trigger"]}
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="menu"
				aria-expanded={open}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
					<path d={ICONS.share} />
				</svg>
				Share
			</button>

			{open && (
				<div className={styles["share-menu__panel"]} role="menu">
					<button type="button" className={styles["share-menu__item"]} onClick={copyLink} role="menuitem">
						<svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
							<path d={ICONS.link} />
						</svg>
						{copied ? "Link copied" : "Copy link"}
					</button>
					{links.map((item) => (
						<a
							key={item.key}
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							className={styles["share-menu__item"]}
							role="menuitem"
							onClick={() => setOpen(false)}
						>
							<svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
								<path d={ICONS[item.key]} />
							</svg>
							{item.label}
						</a>
					))}
				</div>
			)}
		</div>
	);
};

export default ShareMenu;
