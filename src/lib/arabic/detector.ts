/**
 * Utility to detect if a given text contains Arabic characters.
 */
export function isArabic(text: string): boolean {
  if (!text) return false;
  
  /**
   * Arabic Unicode Ranges:
   * \u0600-\u06FF: Arabic
   * \u0750-\u077F: Arabic Supplement
   * \u08A0-\u08FF: Arabic Extended-A
   * \uFB50-\uFDFF: Arabic Presentation Forms-A
   * \uFE70-\uFEFF: Arabic Presentation Forms-B
   */
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  return arabicPattern.test(text);
}

/**
 * Heuristic to check if text is predominantly Arabic.
 * Useful if we want to allow some mixed text but reject mostly Latin input.
 */
export function isPredominantlyArabic(text: string, threshold = 0.5): boolean {
  if (!text) return false;
  
  const totalChars = text.replace(/\s/g, '').length;
  if (totalChars === 0) return false;
  
  const arabicChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  
  return (arabicChars / totalChars) >= threshold;
}
