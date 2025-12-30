interface ValidationResult {
  isValid: boolean;
  error: string;
}

export const validateText = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: true, error: '' };
  }

  const trimmedText = value.trim();

  if (trimmedText.length > 20) {
    return { isValid: false, error: '최대 20자까지 입력 가능합니다.' };
  }

  return { isValid: true, error: '' };
};
