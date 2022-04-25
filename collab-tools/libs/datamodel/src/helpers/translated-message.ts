export interface TranslateMessage {
  level: 'success' | 'error' | 'warn' | 'info';
  titleKey: string;
  messageKey: string;
  life?: number;
  vars?: Record<string, string>;
}
