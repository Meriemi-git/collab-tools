import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AttributeFilter,
  BooleanOperators,
  StratMap,
  StringOperators,
} from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-strat-filters',
  templateUrl: './strat-filters.component.html',
  styleUrls: ['./strat-filters.component.scss'],
})
export class StratFiltersComponent {
  @Input() stratMaps: StratMap[];
  @Input() connected: boolean;
  @Input() public: boolean;
  @Output() filter = new EventEmitter<AttributeFilter>();

  public liked: boolean = null;
  public allSelected = false;
  public stratName: string;
  public selectedStratMaps: StratMap[] = [];
  public sortedBy = 'name';
  public order: 'asc' | 'desc' = 'asc';

  public onFilter() {
    const stratFilter: AttributeFilter = {
      order: this.order,
      sortedBy: this.sortedBy,
      filters: [
        {
          attributeName: 'public',
          value: this.public,
          operator: BooleanOperators.contains,
          aggregated: true,
        },

        {
          attributeName: 'mapId',
          value:
            this.selectedStratMaps?.length === 0
              ? this.stratMaps.map((map) => map._id)
              : this.selectedStratMaps.map((strat) => strat._id),
          operator: StringOperators.in,
        },
      ],
    };

    if (this.stratName) {
      stratFilter.filters.push({
        attributeName: 'name',
        value: this.stratName,
        operator: StringOperators.contains,
      });
    } else if (this.liked != null) {
      stratFilter.filters.push({
        attributeName: 'liked',
        value: this.liked,
        operator: BooleanOperators.contains,
        aggregated: true,
      });
    }
    this.filter.emit(stratFilter);
  }
}
