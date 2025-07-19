// utils/format.js

/**
 * Formata um número como valor monetário em USD.
 * @param {number} value - O número a ser formatado.
 * @returns {string} - O valor formatado (ex: "$1,234.56").
 */
export function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata um número de ouro em onças.
 * @param {number} value - O número de onças de ouro.
 * @returns {string} - O valor formatado (ex: "1.2345 oz").
 */
export function formatGoldAmount(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.00 oz';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4, // Permitir mais casas decimais para ouro
  }).format(value) + ' oz';
}

/**
 * Formata uma data para um formato legível.
 * @param {Date|string} dateInput - A data a ser formatada.
 * @returns {string} - A data formatada (ex: "Jul 18, 2025").
 */
export function formatDate(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Capitaliza a primeira letra de uma string.
 * @param {string} string - A string a ser capitalizada.
 * @returns {string} - A string com a primeira letra em maiúscula.
 */
export function capitalizeFirstLetter(string) {
  if (typeof string !== 'string' || string.length === 0) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
