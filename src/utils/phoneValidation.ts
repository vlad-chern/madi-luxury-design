
export const validatePhoneNumber = (phone: string): boolean => {
  // Убираем все пробелы и специальные символы
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Проверяем испанские номера (9 цифр) или международные (с кодом страны)
  const spanishPhoneRegex = /^[6-9]\d{8}$/; // Испанские мобильные начинаются с 6,7,8,9
  const internationalPhoneRegex = /^(\+34|34)?[6-9]\d{8}$/; // С кодом Испании
  const generalInternationalRegex = /^\+?[1-9]\d{7,14}$/; // Общий международный формат
  
  return spanishPhoneRegex.test(cleanPhone) || 
         internationalPhoneRegex.test(cleanPhone) || 
         generalInternationalRegex.test(cleanPhone);
};

export const formatPhoneNumber = (phone: string): string => {
  // Базовое форматирование для отображения
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Если начинается с +34 или 34, форматируем как испанский номер
  if (cleanPhone.startsWith('+34') || cleanPhone.startsWith('34')) {
    const number = cleanPhone.replace(/^(\+34|34)/, '');
    if (number.length === 9) {
      return `+34 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  }
  
  return phone;
};
