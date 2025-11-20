/**
 * Formatea un número grande con sufijos K, M, B, T, etc.
 * @param num - El número a formatear
 * @returns El número formateado como string (ej: "1.5K", "2.3M", "999")
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return Math.floor(num).toString();
  }

  const units = ['', 'K', 'M', 'B', 'T'];
  let unitIndex = 0;
  let value = num;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  // Si el valor es >= 100, mostrar sin decimales
  if (value >= 100) {
    return `${Math.floor(value)}${units[unitIndex]}`;
  }
  
  // Si el valor es < 100, mostrar 1 decimal
  return `${value.toFixed(1)}${units[unitIndex]}`;
}

