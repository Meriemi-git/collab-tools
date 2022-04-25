export interface FilterMetadata {
  attributeName: string;
  value: unknown;
  operator: string;
  aggregated?: boolean;
}
