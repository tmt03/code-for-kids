export const extractFunctionNames = (code: string): string[] => {
  const lines = code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  return lines
    .map((line) => {
      const match = line.match(/^([a-zA-Z0-9_]+)\s*\(/);
      return match ? match[1] : "";
    })
    .filter((name) => name !== "");
};
