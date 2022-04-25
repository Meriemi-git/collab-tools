import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import {
  DrawerAction,
  DrawerActionType,
  DrawingMode,
  DrawingToolbarAction,
  Layer,
  Strat,
  StratMap,
  UserDto,
} from '@collab-tools/datamodel';
import {
  ClearStratMapState,
  ClearStratState,
  DeleteStrat,
  DiscardCurrentStrat,
  FetchAgents,
  FetchStratMaps,
  getActiveLayer,
  getAllStratLayers,
  getAllStratMaps,
  getDrawingMode,
  getSelectedStratMap,
  getStrat,
  getUserInfos,
  SelectStratMap,
  SetActiveLayer,
  SetDrawerAction,
  SetDrawingMode,
  SetTacticalMode,
  showAgentsPanel,
  showDrawingPanel,
  showGadgetsPanel,
  showGalleryPanel,
  showRoomPanel,
  StratEditorState,
  UpdateStratInfosAndSave,
} from '@collab-tools/store';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../../guards/can-leave-editor-guard';
import { StratMapSelectorComponent } from '../../atoms/map-selector/map-selector.component';
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
  public $maps: Observable<StratMap[]>;
  public $layers: Observable<Layer[]>;
  public $drawingMode: Observable<DrawingMode>;
  public selectedStratMap: StratMap;
  public currentStrat: Strat;
  public userInfos: UserDto;
  public selectedLayer: Layer;
  public layerIsDeprecated: boolean;
  public tacticalMode = false;
  public drawingToolbarIsOpen = false;
  public headingToolbarIsOpen = true;
  public isReadOnly: boolean;
  public DrawingModeEnum = DrawingMode;
  public hasUnsavedModifications: boolean;
  public navigateOut = new Subject<boolean>();

  @ViewChild('mapSelector')
  public mapSelector: StratMapSelectorComponent;

  private stratSavingDialog: DynamicDialogRef;

  constructor(
    private readonly store: Store<StratEditorState>,
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
    this.$maps = this.store
      .select(getAllStratMaps)
      .pipe(takeUntil(this.unsubscriber));

    this.$drawingMode = this.store
      .select(getDrawingMode)
      .pipe(takeUntil(this.unsubscriber));

    this.$layers = this.store
      .select(getAllStratLayers)
      .pipe(takeUntil(this.unsubscriber));

    this.store
      .select(getSelectedStratMap)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((stratMap) => {
        if (stratMap) {
          this.selectedStratMap = stratMap;
        }
      });

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
    this.store
      .select(getActiveLayer)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((layer) => {
        this.selectedLayer = layer;
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

  private askForSwitchStratMap(stratMap: StratMap): void {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(DiscardCurrentStrat());
        this.store.dispatch(SelectStratMap({ stratMap }));
      },
      key: 'editor.map-changing',
      reject: () => {
        this.mapSelector.forceStratMapSelection(this.selectedStratMap);
      },
    });
  }

  private askForDeleteStrat(strat: Strat): void {
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

  public onStratMapSelected(stratMap: StratMap) {
    if (this.selectedStratMap && this.selectedStratMap !== stratMap) {
      this.askForSwitchStratMap(stratMap);
    } else {
      this.store.dispatch(SelectStratMap({ stratMap }));
    }
  }

  public onLayerSelected(layer: Layer) {
    this.tacticalMode = layer.tacticalMode;
    this.store.dispatch(
      SetActiveLayer({
        layer,
      })
    );
  }

  public onSetTacticalMode(tacticalMode: boolean) {
    this.tacticalMode = tacticalMode;
    this.store.dispatch(SetTacticalMode({ tacticalMode }));
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
