export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  enabled?: boolean;
  default?: boolean;
}

export interface LanguageApiResponse {
  success: boolean;
  data: Language[];
}
