export function sanitizeFilename(filename: string): string {
  const regex = /[\/\\\:\*"|]/g;
  const sanitizedFileName = filename
    .replace(regex, "-")
    .replace(/[\.<>]/g, "")
    .replace(/\s+/g, " ");
  return sanitizedFileName.slice(0, 100).trim();
}
