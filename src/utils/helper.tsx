export function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, k) =>
    array.slice(k * size, k * size + size)
  );
}
