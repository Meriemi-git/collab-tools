import { Injectable, Logger } from '@nestjs/common';
import {
  DateOperators,
  FilterMetadata,
  NumberOperators,
  StringOperators,
} from '@collab-tools/datamodel';
import { Document, FilterQuery, Schema } from 'mongoose';

@Injectable()
export class FiltersService {
  private readonly logger = new Logger(FiltersService.name);

  public applyFilterToQuery(
    query: FilterQuery<Document>,
    filterMetadata: FilterMetadata,
    schema: Schema
  ): void {
    const schemaType = schema.path(filterMetadata.attributeName);
    if (schemaType instanceof Schema.Types.String) {
      this.applyStringFilter(query, filterMetadata);
    } else if (schemaType instanceof Schema.Types.Date) {
      this.applyDateFilter(query, filterMetadata);
    } else if (schemaType instanceof Schema.Types.Number) {
      this.applyNumberFilter(query, filterMetadata);
    } else if (schemaType instanceof Schema.Types.Boolean) {
      this.applyBooleanFilter(query, filterMetadata);
    }
  }

  private applyBooleanFilter(
    query: FilterQuery<Document>,
    filterMetadata: FilterMetadata
  ) {
    query[filterMetadata.attributeName] = filterMetadata.value;
  }

  private applyDateFilter(
    query: FilterQuery<Document>,
    filterMetadata: FilterMetadata
  ) {
    const time = Date.parse(filterMetadata.value as string);
    const comparingDate = new Date(time);
    const comparingDateMin = new Date(time).setHours(0, 0, 0, 0);
    const comparingDateMax = new Date(time).setHours(23, 59, 59, 999);

    switch (filterMetadata.operator.toLocaleLowerCase()) {
      case DateOperators.after.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $gte: comparingDate };
        break;
      case DateOperators.before.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $lte: comparingDate };
        break;
      case DateOperators.dateIs.toLocaleLowerCase():
        query[filterMetadata.attributeName] = {
          $gte: comparingDateMin,
          $lte: comparingDateMax,
        };
        break;
      case DateOperators.dateIsNot.toLocaleLowerCase():
        query[filterMetadata.attributeName] = {
          $not: { $gte: comparingDateMin, $lte: comparingDateMax },
        };
        break;
    }
  }

  private applyNumberFilter(
    query: FilterQuery<Document>,
    filterMetadata: FilterMetadata
  ) {
    switch (filterMetadata.operator.toLocaleLowerCase()) {
      case NumberOperators.equals.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $eq: filterMetadata.value };
        break;
      case NumberOperators.notEquals.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $eq: filterMetadata.value };
        break;
      case NumberOperators.lt.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $lt: filterMetadata.value };
        break;
      case NumberOperators.lte.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $lte: filterMetadata.value };
        break;
      case NumberOperators.gt.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $gt: filterMetadata.value };
        break;
      case NumberOperators.gte.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $gte: filterMetadata.value };
        break;
      case NumberOperators.in.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $in: filterMetadata.value };
        break;
    }
  }

  private applyStringFilter(
    query: FilterQuery<Document>,
    filterMetadata: FilterMetadata
  ) {
    let regex: string;
    switch (filterMetadata.operator.toLocaleLowerCase()) {
      case StringOperators.contains.toLocaleLowerCase():
        regex = `(?i)${filterMetadata.value}`;
        query[filterMetadata.attributeName] = { $regex: regex };
        break;
      case StringOperators.endsWith.toLocaleLowerCase():
        regex = `(?i)(${filterMetadata.value})$`;
        query[filterMetadata.attributeName] = { $regex: regex };
        break;
      case StringOperators.startsWith.toLocaleLowerCase():
        regex = `(?i)^(${filterMetadata.value})`;
        query[filterMetadata.attributeName] = { $regex: regex };
        break;
      case StringOperators.notContains.toLocaleLowerCase():
        regex = `(?i)^((?!${filterMetadata.value}).)*$`;
        query[filterMetadata.attributeName] = { $regex: regex };
        break;
      case StringOperators.equals.toLocaleLowerCase():
        regex = `(?i)^(${filterMetadata.value})$`;
        query[filterMetadata.attributeName] = { $regex: regex };
        break;
      case StringOperators.notEquals.toLocaleLowerCase():
        regex = `(?i)^(?!${filterMetadata.value}$).*$`;
        query[filterMetadata.attributeName] = { $regex: regex };
        break;
      case StringOperators.in.toLocaleLowerCase():
        query[filterMetadata.attributeName] = { $in: filterMetadata.value };
        break;
    }
  }
}
