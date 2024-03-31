export const getUniqueValues = <T>(data: T[], key: keyof T): string[] => {
  const uniqueValues = data.reduce((unique, item) => {
    const value = item[key];
    if (typeof value === "string") {
      unique.add(value);
    }
    return unique;
  }, new Set<string>());

  return [...uniqueValues];
};

interface SortableById {
  id: number | string;
}

export function sortByIdAsc<T extends SortableById>(array: T[]): T[] {
  return array.sort((a, b) => Number(a.id) - Number(b.id));
}
