import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Color,
  DrawerAction,
  DrawerActionType,
  DrawerOption,
  DrawerOptionName,
  StrockSize,
} from '@collab-tools/datamodel';
import {
  CollabToolsState,
  getAllActions,
  getAllOptions,
  getFontSize,
  getOptionByName,
  SetDrawerAction,
  SetFillColor,
  SetFontSize,
  SetStrokeColor,
  SetStrokeWidth,
  ToogleDrawerOptionActivation,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-drawing-panel',
  templateUrl: './drawing-panel.component.html',
  styleUrls: ['./drawing-panel.component.scss'],
})
export class DrawingPanelComponent implements OnInit, OnDestroy {
  public color: Color;
  public opacity: number;
  public strokeSizes: StrockSize[];

  public selectedStrokeWidth: number;
  public drawerActions: DrawerAction[];

  public drawerOptions: DrawerOption[];

  public fontSizes: number[];
  public DrawingActionType: typeof DrawerActionType = DrawerActionType;
  public selectedSize: number;
  private readonly unsubscriber = new Subject();

  public selectedTextOptions: DrawerAction[];

  constructor(private readonly store: Store<CollabToolsState>) {
    this.fontSizes = Array(100)
      .fill(0)
      .map((x, i) => i + 1);
    this.opacity = 1;
    this.color = {
      r: 255,
      g: 255,
      b: 255,
    };
    this.strokeSizes = [
      { size: 1, label: '1 px' },
      { size: 3, label: '3 px' },
      { size: 5, label: '5 px' },
      { size: 10, label: '10 px' },
      { size: 20, label: '20 px' },
      { size: 50, label: '50 px' },
      { size: 100, label: '100 px' },
    ];
  }
  ngOnDestroy(): void {
    this.unsubscriber.next(null);
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.store
      .select(getAllActions)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((drawActions) => {
        this.drawerActions = drawActions;
      });

    this.store
      .select(getAllOptions)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((drawerOptions) => {
        this.drawerOptions = drawerOptions;
      });

    this.store
      .select(getFontSize)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        (sizeOption) =>
          (this.selectedSize = sizeOption.active
            ? (sizeOption.value as number)
            : (sizeOption.initialValue as number))
      );
    this.store
      .select(getOptionByName(DrawerOptionName.STROKE_WIDTH))
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        (width) =>
          (this.selectedStrokeWidth = width.active
            ? (width.value as number)
            : (width.initialValue as number))
      );
  }

  public onSelectColor() {
    const colorValue = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
    this.store.dispatch(SetFillColor({ colorValue }));
    this.store.dispatch(SetStrokeColor({ colorValue }));
  }

  public onActionSelected(action: DrawerAction) {
    this.store.dispatch(SetDrawerAction({ action }));
  }

  public onFontSizeSelected(fontSize: number) {
    this.store.dispatch(SetFontSize({ fontSize }));
  }

  public drawActionComparer(a: DrawerAction, b: DrawerAction): number {
    return a.order < b.order ? -1 : a.order === b.order ? 0 : 1;
  }

  public onTextOptionClicked(option: DrawerOption) {
    this.store.dispatch(
      ToogleDrawerOptionActivation({
        option,
      })
    );
  }

  public onSetStrokeWidth(width: number) {
    this.store.dispatch(SetStrokeWidth({ width }));
  }
}
