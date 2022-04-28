import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import {
  AttributeFilter,
  BooleanOperators,
  Draw,
  DrawingMode,
  DrawMap,
  Like,
  PageEvent,
  PageOptions,
  UserDto,
} from '@collab-tools/datamodel';
import {
  CollabToolsState,
  DeleteDraw,
  DislikeDraw,
  FetchDrawMaps,
  getAllDrawMaps,
  getDrawPageMetadata,
  GetDrawsPaginated,
  getUserInfos,
  getUserLikes,
  GetUserLikes,
  LikeDraw,
  LoadDrawSuccess,
  selectAllDraws,
  SetDrawingMode,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-filtered-draws',
  templateUrl: './filtered-draws.component.html',
  styleUrls: ['./filtered-draws.component.scss'],
})
export class FilteredDrawsComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  @Input()
  public isPublic: boolean;
  public $draws: Observable<Draw[]>;
  public $userInfos: Observable<UserDto>;
  public $userLikes: Observable<Like[]>;
  public $drawMaps: Observable<DrawMap[]>;
  public length: number;
  public rows = 10;
  public activeIndex: number;
  public drawFilter: AttributeFilter;

  constructor(
    private readonly store: Store<CollabToolsState>,
    private readonly confirmationService: ConfirmationService,
    public readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.$userInfos = this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber));

    this.$userLikes = this.store
      .select(getUserLikes)
      .pipe(takeUntil(this.unsubscriber));

    this.$draws = this.store
      .select(selectAllDraws)
      .pipe(takeUntil(this.unsubscriber));

    this.$drawMaps = this.store
      .select(getAllDrawMaps)
      .pipe(takeUntil(this.unsubscriber));

    this.store
      .select(getDrawPageMetadata)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((pageMetadata) => {
        if (pageMetadata) {
          this.length = pageMetadata.totalDocs;
        }
      });
    this.drawFilter = {
      filters: [
        {
          attributeName: 'public',
          operator: BooleanOperators.contains,
          value: this.isPublic,
          aggregated: true,
        },
      ],
      order: 'asc',
      sortedBy: 'name',
    };
    this.store.dispatch(FetchDrawMaps());
    this.store.dispatch(GetUserLikes());
    this.store.dispatch(
      GetDrawsPaginated({
        pageOptions: {
          limit: this.rows,
          page: 1,
        },
        drawFilter: this.drawFilter,
      })
    );
  }

  onSelectDraw(draw: Draw) {
    this.store.dispatch(LoadDrawSuccess({ draw }));
    this.store.dispatch(SetDrawingMode({ drawingMode: DrawingMode.ReadOnly }));
    this.router.navigateByUrl('editor');
  }

  onFilterDraw(filter: AttributeFilter) {
    this.drawFilter = filter;
    this.activeIndex = -1;
    this.store.dispatch(
      GetDrawsPaginated({
        pageOptions: {
          limit: this.rows,
          page: 1,
        },
        drawFilter: {
          ...this.drawFilter,
        },
      })
    );
  }

  onDeleteDraw(draw: Draw) {
    this.confirmationService.confirm({
      message: `Do you really want to delete this draw :<br />${draw.name}`,
      header: 'Deleting draw',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(DeleteDraw({ drawId: draw._id }));
      },
    });
  }

  public paginate(pageEvent: PageEvent) {
    this.rows = pageEvent.rows;
    this.store.dispatch(
      GetDrawsPaginated({
        pageOptions: {
          limit: pageEvent.rows,
          page: pageEvent.page + 1,
        } as PageOptions,
        drawFilter: this.drawFilter,
      })
    );
  }

  public onLikeDraw(draw: Draw) {
    this.store.dispatch(LikeDraw({ draw }));
  }

  public onDislikeDraw(draw: Draw) {
    this.store.dispatch(DislikeDraw({ draw }));
  }

  drawComparer(a: Draw, b: Draw): number {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }
}
