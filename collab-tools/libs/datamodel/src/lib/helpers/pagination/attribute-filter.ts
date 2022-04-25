import { FilterMetadata } from './filter-metadata';

export interface AttributeFilter {
  filters: FilterMetadata[];
  sortedBy: string;
  order: 'asc' | 'desc';
}
