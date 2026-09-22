const PLACEHOLDERS = new Set([
	"",
	"n/a",
	"na",
	"not specified",
	"not-specified",
	"notspecified",
	"unspecified",
	"none",
	"null",
	"undefined",
	"-",
	"--",
]);

export function hasValue(raw: unknown): boolean {
	if (raw === null || raw === undefined) return false;
	return !PLACEHOLDERS.has(String(raw).trim().toLowerCase());
}
