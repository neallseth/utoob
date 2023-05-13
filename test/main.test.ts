import { sanitizeFilename } from "../src/utils/file-utils";

test("Ensure filenames sanitize", () => {
  const invalidName = "  linear algebra: chapter 7... <vectors/matrices>";
  const sanitizedName = "linear algebra- chapter 7 vectors-matrices";
  expect(sanitizeFilename(invalidName)).toBe(sanitizedName);
});
