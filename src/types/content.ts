import type { Language, Translation } from './schema.ts';
import { localeId } from './locale-id.ts';
import { localeEn } from './locale-en.ts';

export type { Language, Translation };
export const translations: Record<Language, Translation> = {
  id: localeId,
  en: localeEn,
};
