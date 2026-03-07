/**
 * Foundational Arabic Grammar (Nahwu) hints to prime the AI model.
 * Helps small local models maintain logical consistency.
 */
export const GRAMMAR_HINTS = `
## ARABIC GRAMMAR HINTS (NAHWU)
1. Sentence Structure:
   - Jumlah Fi'liyyah: Starts with a Verb (Fi'il). Structure: Fi'il + Fa'il + (Maf'ul Bihi).
   - Jumlah Ismiyyah: Starts with a Noun (Isim). Structure: Mubtada' + Khabar.
2. Word Rules:
   - Fi'il usually precedes Fa'il.
   - Harf Jar (e.g., bi, li, fi, 'ala) MUST be followed by Isim Majrur (kasrah).
   - Mubtada' and Khabar are always Marfu' (dhammah).
   - Fa'il is always Marfu' (dhammah).
   - Maf'ul Bihi is always Manshub (fathah).
3. Attached Particles:
   - Particles like "bi-", "li-", "wa-", "ka-" are attached to the following word but have separate grammatical roles.
`;
