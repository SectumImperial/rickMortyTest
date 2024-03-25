export const getUniqueValues = (data, key) => {
  const uniqueValues = data.reduce((unique, item) => {
    unique.add(item[key]);
    return unique;
  }, new Set());

  return [...uniqueValues];
};
