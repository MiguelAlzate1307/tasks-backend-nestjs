export const castEnumsToArray = (...enums: object[]): string[] => {
  const arr: string[] = [];

  for (const i of enums)
    for (const [, value] of Object.entries(i)) arr.push(value);

  return arr;
};
