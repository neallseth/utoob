"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFilename = void 0;
function sanitizeFilename(filename) {
    const regex = /[\/\\\:\*"|]/g;
    const sanitizedFileName = filename
        .replace(regex, "-")
        .replace(/[\.<>]/g, "")
        .replace(/\s+/g, " ");
    return sanitizedFileName.slice(0, 100).trim();
}
exports.sanitizeFilename = sanitizeFilename;
//# sourceMappingURL=file-utils.js.map