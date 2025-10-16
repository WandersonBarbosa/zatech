export function formatPhoneNumber(number: string): string {
  // Remove espaços, traços e parênteses
  const cleaned = number.replace(/\D/g, '');

  // Se não tiver DDI, adiciona +55 (Brasil)
  let formatted = cleaned;
  if (cleaned.length === 11 && cleaned.startsWith('9')) {
    // assume que é local, adiciona DDD + DDI
    formatted = '55' + cleaned;
  } else if (cleaned.length === 10) {
    // assume que é fixo (sem o 9) com DDD
    formatted = '55' + cleaned;
  } else if (cleaned.length === 13 && !cleaned.startsWith('55')) {
    // já inclui DDI
    formatted = cleaned;
  }

  return `${formatted}@s.whatsapp.net`;
}

