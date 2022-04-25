import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AttributeFilter,
  BooleanOperators,
  DrawingMode,
  Like,
  PageEvent,
  PageOptions,
  Strat,
  StratMap,
  UserDto,
} from '@collab-tools/datamodel';
import {
  DeleteStrat,
  DislikeStrat,
  FetchStratMaps,
  getAllStratMaps,
  getStratPageMetadata,
  GetStratsPaginated,
  getUserInfos,
  getUserLikes,
  GetUserLikes,
  LikeStrat,
  LoadStratSuccess,
  selectAllStrats,
  SetDrawingMode,
  StratEditorState,
} from '@collab-tools/store';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-filtered-strats',
  templateUrl: './filtered-strats.component.html',
  styleUrls: ['./filtered-strats.component.scss'],
})
export class FilteredStratsComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  @Input()
  public isPublic: boolean;
  public $strats: Observable<Strat[]>;
  public $userInfos: Observable<UserDto>;
  public $userLikes: Observable<Like[]>;
  public $stratMaps: Observable<StratMap[]>;
  public length: number;
  public rows = 10;
  public activeIndex: number;
  public stratFilter: AttributeFilter;

  constructor(
    private readonly store: Store<StratEditorState>,
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

    this.$strats = this.store
      .select(selectAllStrats)
      .pipe(takeUntil(this.unsubscriber));

    this.$stratMaps = this.store
      .select(getAllStratMaps)
      .pipe(takeUntil(this.unsubscriber));

    this.store
      .select(getStratPageMetadata)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((pageMetadata) => {
        if (pageMetadata) {
          this.length = pageMetadata.totalDocs;
        }
      });
    this.stratFilter = {
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
    this.store.dispatch(FetchStratMaps());
    this.store.dispatch(GetUserLikes());
    this.store.dispatch(
      GetStratsPaginated({
        pageOptions: {
          limit: this.rows,
          page: 1,
        },
        stratFilter: this.stratFilter,
      })
    );
  }

  onSelectStrat(strat: Strat) {
    this.store.dispatch(LoadStratSuccess({ strat }));
    this.store.dispatch(SetDrawingMode({ drawingMode: DrawingMode.ReadOnly }));
    this.router.navigateByUrl('editor');
  }

  onFilterStrat(filter: AttributeFilter) {
    this.stratFilter = filter;
    this.activeIndex = -1;
    this.store.dispatch(
      GetStratsPaginated({
        pageOptions: {
          limit: this.rows,
          page: 1,
        },
        stratFilter: {
          ...this.stratFilter,
        },
      })
    );
  }

  onDeleteStrat(strat: Strat) {
    this.confirmationService.confirm({
      message: `Do you really want to delete this strat :<br />${strat.name}`,
      header: 'Deleting strat',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(DeleteStrat({ stratId: strat._id }));
      },
    });
  }

  public paginate(pageEvent: PageEvent) {
    this.rows = pageEvent.rows;
    this.store.dispatch(
      GetStratsPaginated({
        pageOptions: {
          limit: pageEvent.rows,
          page: pageEvent.page + 1,
        } as PageOptions,
        stratFilter: this.stratFilter,
      })
    );
  }

  public onLikeStrat(strat: Strat) {
    this.store.dispatch(LikeStrat({ strat }));
  }

  public onDislikeStrat(strat: Strat) {
    this.store.dispatch(DislikeStrat({ strat }));
  }

  stratComparer(a: Strat, b: Strat): number {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }
}
