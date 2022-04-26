import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import {
  Draw,
  DrawerAction,
  DrawerActionType,
  DrawingMode,
  DrawingToolbarAction,
  UserDto,
} from '@collab-tools/datamodel';
import {
  ClearDrawState,
  CollabToolsState,
  DeleteDraw,
  getDraw,
  getDrawingMode,
  isConfirmed,
  SetDrawerAction,
  SetDrawingMode,
  showAgentsPanel,
  showDrawingPanel,
  showGadgetsPanel,
  showGalleryPanel,
  showRoomPanel,
  UpdateDrawInfosAndSave,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../../guards/can-leave-editor-guard';
import {
  DrawInfosDialogData,
  DrawSavingDialogComponent,
} from '../../molecules/draw-saving-dialog/draw-saving-dialog.component';

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
  public $userConfirmed: Observable<boolean>;

  public currentDraw: Draw;
  public userInfos: UserDto;
  public drawingToolbarIsOpen = false;
  public headingToolbarIsOpen = true;
  public isReadOnly: boolean;
  public DrawingModeEnum = DrawingMode;
  public hasUnsavedModifications: boolean;
  public navigateOut = new Subject<boolean>();

  private drawSavingDialog: DynamicDialogRef;

  constructor(
    private readonly store: Store<CollabToolsState>,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly dialogService: DialogService
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
    this.store.dispatch(ClearDrawState());
    if (this.drawSavingDialog) {
      this.drawSavingDialog.close();
    }
  }

  ngOnInit(): void {
    this.$drawingMode = this.store
      .select(getDrawingMode)
      .pipe(takeUntil(this.unsubscriber));

    this.store
      .select(getDraw)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((draw) => {
        this.currentDraw = draw;
      });
    this.$userConfirmed = this.store
      .select(isConfirmed)
      .pipe(takeUntil(this.unsubscriber));
  }

  private askForDeleteDraw(draw: Draw): void {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      key: 'editor.delete-draw',
      accept: () => {
        this.store.dispatch(DeleteDraw({ drawId: draw._id }));
      },
    });
  }

  private askForSaveDraw() {
    if (this.currentDraw) {
      this.drawSavingDialog = this.dialogService.open(
        DrawSavingDialogComponent,
        {
          data: {
            name: this.currentDraw.name,
            description: this.currentDraw.description,
          },
          styleClass: 'draw-saving-dialog',
          baseZIndex: 10000,
          showHeader: false,
        }
      );
      this.drawSavingDialog.onClose
        .pipe(takeUntil(this.unsubscriber))
        .subscribe((drawInfos: DrawInfosDialogData) => {
          if (drawInfos) {
            this.store.dispatch(UpdateDrawInfosAndSave(drawInfos));
            this.hasUnsavedModifications = false;
          }
        });
    }
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
        this.askForDeleteDraw(this.currentDraw);
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
        this.router.navigateByUrl('my-draws');
        break;
      case DrawingToolbarAction.SAVE_STRAT:
        this.askForSaveDraw();
        break;
      case DrawingToolbarAction.SHOW_INFOS:
        this.askForSaveDraw();
        break;
      case DrawingToolbarAction.DOWNLOAD_STRAT:
        this.store.dispatch(
          SetDrawerAction({
            action: {
              type: DrawerActionType.MISC,
              name: 'Download',
              label: this.currentDraw.name,
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
