import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AttributeFilter,
  BooleanOperators,
  DrawMap,
  StringOperators,
} from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-draw-filters',
  templateUrl: './draw-filters.component.html',
  styleUrls: ['./draw-filters.component.scss'],
})
export class DrawFiltersComponent {
  @Input() drawMaps: DrawMap[];
  @Input() connected: boolean;
  @Input() public: boolean;
  @Output() filter = new EventEmitter<AttributeFilter>();

  public liked: boolean = null;
  public allSelected = false;
  public drawName: string;
  public selectedDrawMaps: DrawMap[] = [];
  public sortedBy = 'name';
  public order: 'asc' | 'desc' = 'asc';

  public onFilter() {
    const drawFilter: AttributeFilter = {
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
            this.selectedDrawMaps?.length === 0
              ? this.drawMaps.map((map) => map._id)
              : this.selectedDrawMaps.map((draw) => draw._id),
          operator: StringOperators.in,
        },
      ],
    };

    if (this.drawName) {
      drawFilter.filters.push({
        attributeName: 'name',
        value: this.drawName,
        operator: StringOperators.contains,
      });
    } else if (this.liked != null) {
      drawFilter.filters.push({
        attributeName: 'liked',
        value: this.liked,
        operator: BooleanOperators.contains,
        aggregated: true,
      });
    }
    this.filter.emit(drawFilter);
  }
}
