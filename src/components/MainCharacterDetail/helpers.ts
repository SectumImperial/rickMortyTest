export function extractNumbersFromEnd(url: string): string[] {
  const urlParts = url.split("/");
  const lastPart = urlParts[urlParts.length - 1];
  const page = urlParts[urlParts.length - 2] + "s";
  const numbers = lastPart.match(/\d+/g);
  if (numbers) {
    return [page, ...numbers];
  }

  return [];
}
