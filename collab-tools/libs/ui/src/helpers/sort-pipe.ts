import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBy' })
export class SortPipe<T> implements PipeTransform {
  transform(value: T[], order: 'asc', comparer: (a: T, b: T) => number): T[] {
    if (!value || value.length <= 1) {
      return value;
    } // no array
    if (order?.toLocaleLowerCase() === 'desc') {
      const result = [...value].sort(comparer);
      return result.reverse();
    } else {
      return [...value].sort(comparer);
    }
  }
}
