import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import {
  Draw,
  DrawerAction,
  DrawerActionType,
  DrawingMode,
  DrawingToolbarAction,
  Layer,
  UserDto,
} from '@collab-tools/datamodel';
import {
  ClearStratMapState,
  ClearStratState,
  CollabToolsState,
  DeleteStrat,
  FetchAgents,
  FetchStratMaps,
  getDrawingMode,
  getStrat,
  getUserInfos,
  SetDrawerAction,
  SetDrawingMode,
  showAgentsPanel,
  showDrawingPanel,
  showGadgetsPanel,
  showGalleryPanel,
  showRoomPanel,
  UpdateStratInfosAndSave,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../../guards/can-leave-editor-guard';
import {
  StratInfosDialogData,
  StratSavingDialogComponent,
} from '../../molecules/strat-saving-dialog/strat-saving-dialog.component';

@Component({
  selector: 'collab-tools-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [DialogService],
})
export class EditorComponent
  extends AbsctractObserverComponent
  implements OnInit, OnDestroy, ComponentCanDeactivate
{
  public $drawingMode: Observable<DrawingMode>;
  public currentStrat: Draw;
  public userInfos: UserDto;
  public drawingToolbarIsOpen = false;
  public headingToolbarIsOpen = true;
  public isReadOnly: boolean;
  public DrawingModeEnum = DrawingMode;
  public hasUnsavedModifications: boolean;
  public navigateOut = new Subject<boolean>();

  private stratSavingDialog: DynamicDialogRef;

  constructor(
    private readonly store: Store<CollabToolsState>,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly dialogService: DialogService,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedModifications) {
      this.confirmationService.confirm({
        icon: 'pi pi-exclamation-triangle',
        key: 'editor.navigate-out',
        acceptButtonStyleClass: 'confirm-dialog-accept',
        rejectButtonStyleClass: 'reject-dialog-accept',
        accept: () => {
          this.navigateOut.next(true);
        },
        reject: () => {
          this.navigateOut.next(false);
        },
      });
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(ClearStratState());
    this.store.dispatch(ClearStratMapState());
    if (this.stratSavingDialog) {
      this.stratSavingDialog.close();
    }
  }

  ngOnInit(): void {
    this.$drawingMode = this.store
      .select(getDrawingMode)
      .pipe(takeUntil(this.unsubscriber));

    this.store
      .select(getStrat)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((strat) => {
        this.currentStrat = strat;
        if (strat.userId) {
          this.store
            .select(getUserInfos)
            .pipe(takeUntil(this.unsubscriber))
            .subscribe((userInfos) => {
              this.userInfos = userInfos;
              if (userInfos && strat.userId === userInfos._id) {
                this.store.dispatch(
                  SetDrawingMode({ drawingMode: DrawingMode.Drawing })
                );
              } else {
                SetDrawingMode({ drawingMode: DrawingMode.ReadOnly });
              }
            });
        } else {
          this.store.dispatch(
            SetDrawingMode({ drawingMode: DrawingMode.Drawing })
          );
        }
      });

    this.$drawingMode
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((drawingMode) => {
        this.isReadOnly = drawingMode === DrawingMode.ReadOnly;
        this.changeDetector.detectChanges();
      });

    this.store.dispatch(FetchStratMaps());
    this.store.dispatch(FetchAgents());
  }

  private askForDeleteStrat(strat: Draw): void {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      key: 'editor.delete-strat',
      accept: () => {
        this.store.dispatch(DeleteStrat({ stratId: strat._id }));
      },
    });
  }

  private askForSaveStrat() {
    if (this.currentStrat) {
      this.stratSavingDialog = this.dialogService.open(
        StratSavingDialogComponent,
        {
          data: {
            name: this.currentStrat.name,
            description: this.currentStrat.description,
            isPublic: this.currentStrat.isPublic,
          },
          styleClass: 'strat-saving-dialog',
          baseZIndex: 10000,
          showHeader: false,
        }
      );
      this.stratSavingDialog.onClose
        .pipe(takeUntil(this.unsubscriber))
        .subscribe((stratInfos: StratInfosDialogData) => {
          if (stratInfos) {
            this.store.dispatch(UpdateStratInfosAndSave(stratInfos));
            this.hasUnsavedModifications = false;
          }
        });
    }
  }

  public layerComparer(f1: Layer, f2: Layer): number {
    return f1.floor.level < f2.floor.level
      ? -1
      : f1.floor.level === f2.floor.level
      ? 0
      : 1;
  }

  public openAgentsPanel() {
    this.store.dispatch(showAgentsPanel());
  }

  public openGadgetsPanel() {
    this.store.dispatch(showGadgetsPanel());
  }

  public openDrawingPanel() {
    this.store.dispatch(showDrawingPanel());
  }

  public openGalleryPanel() {
    this.store.dispatch(showGalleryPanel());
  }

  public openRoomPanel() {
    this.store.dispatch(showRoomPanel());
  }

  public onSelectToolbarAction(toolbarAction: DrawingToolbarAction) {
    switch (toolbarAction) {
      case DrawingToolbarAction.CENTER_MAP:
        break;
      case DrawingToolbarAction.CLEAR_STRAT:
        this.store.dispatch(
          SetDrawerAction({
            action: {
              type: DrawerActionType.MISC,
              name: 'Clear',
            } as DrawerAction,
          })
        );
        break;
      case DrawingToolbarAction.DELETE_STRAT:
        this.askForDeleteStrat(this.currentStrat);
        break;
      case DrawingToolbarAction.ENABLE_DRAGGING_MODE:
        this.store.dispatch(
          SetDrawingMode({ drawingMode: DrawingMode.Dragging })
        );
        break;
      case DrawingToolbarAction.ENABLE_DRAWING_MODE:
        this.store.dispatch(
          SetDrawingMode({ drawingMode: DrawingMode.Drawing })
        );
        break;
      case DrawingToolbarAction.ENABLE_SELECT_MODE:
        this.store.dispatch(
          SetDrawingMode({ drawingMode: DrawingMode.Selection })
        );
        break;
      case DrawingToolbarAction.OPEN_STRAT:
        this.router.navigateByUrl('my-strats');
        break;
      case DrawingToolbarAction.SAVE_STRAT:
        this.askForSaveStrat();
        break;
      case DrawingToolbarAction.SHOW_INFOS:
        this.askForSaveStrat();
        break;
      case DrawingToolbarAction.DOWNLOAD_STRAT:
        this.store.dispatch(
          SetDrawerAction({
            action: {
              type: DrawerActionType.MISC,
              name: 'Download',
              label: this.currentStrat.name,
            } as DrawerAction,
          })
        );
        break;
      default:
        break;
    }
  }

  public stopWheelEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  public openToolBar() {
    this.drawingToolbarIsOpen = true;
  }
}
