/**
 * Formatea un número grande con sufijos K, M, B, T, etc.
 * Muestra el máximo número posible para que los números se vean más grandes.
 * Usa más dígitos y retrasa el uso de sufijos para maximizar el número mostrado.
 * @param num - El número a formatear
 * @returns El número formateado como string (ej: "1,234", "999K", "15.5M")
 */
export function formatNumber(num: number): string {
  const sign = num < 0 ? '-' : '';
  let value = Math.abs(num);

  // For numbers < 1 million, show with comma separators for maximum impact
  if (value < 1000000) {
    return `${sign}${Math.round(value).toLocaleString('en-US')}`;
  }

  const units = ['', 'K', 'M', 'B', 'T'];
  let unitIndex = 0;
  let originalValue = value;

  // Find the appropriate unit
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  // Show maximum precision to make numbers appear larger
  // For values >= 100, show no decimals (e.g., "150M" instead of "150.0M")
  if (value >= 100) {
    return `${sign}${Math.floor(value)}${units[unitIndex]}`;
  }
  
  // For values >= 10, show 1 decimal place (e.g., "15.5M")
  if (value >= 10) {
    return `${sign}${value.toFixed(1)}${units[unitIndex]}`;
  }
  
  // For values < 10, show 2 decimal places (e.g., "9.99M")
  return `${sign}${value.toFixed(2)}${units[unitIndex]}`;
}

/**
 * Formatea valores de krakenlings utilizando siempre enteros (sin decimales).
 */
export function formatKrakenValue(num: number): string {
  return formatNumber(num);
}
