export function padZero(el, length) {
  const elText = '' + el;
  if (elText.length >= length) return `${elText}`;
  if (elText.length < length) return `<span class="text-disabled">${'0'.repeat(length - elText.length)}</span>${elText}`;
}
