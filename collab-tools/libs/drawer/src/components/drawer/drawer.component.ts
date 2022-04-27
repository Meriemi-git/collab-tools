import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  CanvasActions,
  DrawerAction,
  DrawerActionType,
  DrawerOption,
  DrawingMode,
  Image,
  KEY_CODE,
  PolyLineAction,
} from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';
import {
  AttachImage,
  ClearCanvasState,
  CollabToolsState,
  DragImageSuccess,
  getAllOptions,
  getCanvasAndAction,
  getDistantCanavasDimensions,
  getDraggedImage,
  getDraggedImageLink,
  getDrawingMode,
  getObjectsToAdd,
  getObjectsToRemove,
  getSelectedAction,
  RedoCanvasState,
  SetDrawerAction,
  SetDrawingMode,
  UnAttachImage,
  UndoCanvasState,
  UpdateCanvas,
  UpdateDistantCanvas,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { fabric } from 'fabric';
import * as FileSaver from 'file-saver';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid';
import { ArrowDrawer } from '../../drawers/arrow-drawer';
import { LineDrawer } from '../../drawers/line-drawer';
import { ObjectDrawer } from '../../drawers/object-drawer';
import { OvalDrawer } from '../../drawers/oval-drawer';
import { PolyLineDrawer } from '../../drawers/polyline-drawer';
import { RectangleDrawer } from '../../drawers/rectangle-drawer';
import { SvgDrawer } from '../../drawers/svg-drawer';
import { TextDrawer } from '../../drawers/text-drawer';
import { TriangleDrawer } from '../../drawers/triangle-drawer';
import { IndexedOptions } from '../../fabricjs/indexed-options';
import { LineArrow } from '../../fabricjs/line-arrow';
import { TriangleArrow } from '../../fabricjs/triangle-arrow';

@Component({
  selector: 'collab-tools-drawer',
  templateUrl: './drawer.component.html',
})
export class DrawerComponent implements OnInit, OnDestroy {
  @Input() readonly: boolean;
  @Output() mapLoadingError = new EventEmitter<void>();

  public drawingMode: DrawingMode;

  private canvas: fabric.Canvas;

  private drawer: ObjectDrawer;

  private avalaibleDrawers: Map<string, ObjectDrawer>;

  private drawerOptions: IndexedOptions;
  private objects: fabric.Object[] = [];

  private isDown: boolean;
  private editingText: boolean;

  private selectedObjects: fabric.Object[] = [];

  private lastPosX = 0;
  private lastPosY = 0;

  private draggingImage: Image;
  private CTRLPressed: boolean;
  private canvasLoading: boolean;
  private readonly unsubscriber = new Subject();
  private draggingImageLink: string;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly ihs: ImageHelperService,
    private readonly store: Store<CollabToolsState>
  ) {
    this.addAvalaibleDrawers();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next(null);
    this.unsubscriber.complete();
    this.store.dispatch(ClearCanvasState());
  }

  ngOnInit(): void {
    this.initCanvas();
    this.initializeCanvasEvents();
    this.store
      .select(getAllOptions)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((options) => {
        this.updateOptions(options);
      });

    this.store
      .select(getSelectedAction)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((action) => {
        if (action && !this.readonly) {
          this.doAction(action);
        }
      });

    this.store
      .select(getDrawingMode)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((drawingMode) => {
        if (drawingMode) {
          this.manageDrawingMode(drawingMode);
        }
      });

    this.store
      .select(getDraggedImage)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((image) => {
        this.draggingImage = image;
        if (image) {
          this.draggingImageLink = null;
        }
      });

    this.store
      .select(getDraggedImageLink)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((link) => {
        this.draggingImageLink = link;
        if (link) {
          this.draggingImage = null;
        }
      });

    this.store
      .select(getCanvasAndAction)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((canvasAndAction) => {
        if (canvasAndAction) {
          this.manageCanvasByAction(
            canvasAndAction.canvas,
            canvasAndAction.action
          );
        }
      });

    this.store
      .select(getObjectsToAdd)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((objects) => {
        this.store
          .select(getDistantCanavasDimensions)
          .pipe(take(1))
          .subscribe((dimensions) => {
            const scaleFactor = this.canvas.width / dimensions.width;
            if (objects && objects.length > 0) {
              fabric.util.enlivenObjects(
                objects,
                function (newObjectList: fabric.Object[]) {
                  newObjectList.forEach((newObject) => {
                    this.canvas.add(newObject);
                    newObject.set({
                      left: newObject.left * scaleFactor,
                      top: newObject.top * scaleFactor,
                      scaleX: newObject.scaleX * scaleFactor,
                      scaleY: newObject.scaleY * scaleFactor,
                    });
                  });
                  this.canvas.renderAll();
                  this.store.dispatch(
                    UpdateDistantCanvas({ canvas: this.getCanvasState() })
                  );
                }.bind(this),
                'fabric'
              );
            }
          });
      });

    this.store
      .select(getObjectsToRemove)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((objects) => {
        if (objects && objects.length > 0) {
          // TODO create tracable object inherit to fabric.object
          this.canvas.forEachObject((object: any) => {
            if (objects.includes(object['guid'])) {
              this.canvas.remove(object);
            }
          });
          this.canvas.renderAll();
          this.store.dispatch(
            UpdateDistantCanvas({ canvas: this.getCanvasState() })
          );
        }
      });
    this.store.dispatch(SetDrawingMode({ drawingMode: DrawingMode.Drawing }));
  }

  private initCanvas() {
    this.isDown = false;
    fabric.Canvas.prototype.toDatalessJSON = (function (toDatalessJSON) {
      return function (propertiesToInclude) {
        return fabric.util.object.extend(
          toDatalessJSON.call(this, propertiesToInclude),
          {
            width: this.width,
            height: this.height,
          }
        );
      };
    })(fabric.Canvas.prototype.toDatalessJSON);
    this.canvas = new fabric.Canvas('canvas', {
      selection: false,
      preserveObjectStacking: true,
      width: window.innerWidth,
      height: window.innerHeight - 93,
    });
    this.drawer = this.avalaibleDrawers.get('polyline');
    this.drawerOptions = {
      guid: null,
      name: 'line',
      strokeWidth: 10,
      selectable: true,
      strokeUniform: true,
    };
  }

  private addAvalaibleDrawers() {
    this.avalaibleDrawers = new Map<string, ObjectDrawer>();
    this.avalaibleDrawers.set('line', new LineDrawer());
    this.avalaibleDrawers.set('arrow', new ArrowDrawer());
    this.avalaibleDrawers.set('triangle', new TriangleDrawer());
    this.avalaibleDrawers.set('rectangle', new RectangleDrawer());
    this.avalaibleDrawers.set('circle', new OvalDrawer());
    this.avalaibleDrawers.set('text', new TextDrawer());
    this.avalaibleDrawers.set('polyline', new PolyLineDrawer());
    this.avalaibleDrawers.set('star', new SvgDrawer('star', this.ihs));
    this.avalaibleDrawers.set('time', new SvgDrawer('time', this.ihs));
    this.avalaibleDrawers.set('location', new SvgDrawer('location', this.ihs));
  }

  private manageCanvasByAction(canvas: unknown, action: CanvasActions) {
    switch (action) {
      case CanvasActions.INIT_CANVAS:
        this.clear();
        break;
      case CanvasActions.LOAD_CANVAS:
        this.clear();
        this.setCanvasState(canvas);
        this.store.dispatch(SetDrawerAction({ action: new PolyLineAction() }));
        break;
      default:
        break;
    }
  }

  private manageDrawingMode(newDrawingMode: DrawingMode) {
    if (this.drawingMode !== newDrawingMode) {
      switch (newDrawingMode) {
        case DrawingMode.Selection:
          this.enableSelectionMode();
          break;
        case DrawingMode.Dragging:
          this.enableDraggingMode();
          break;
        case DrawingMode.Drawing:
          this.enableDrawingMode();
          break;
        case DrawingMode.ReadOnly:
          this.enableReadOnlyMode();
          break;
        default:
      }
      this.drawingMode = newDrawingMode;
    }
  }

  public setStokeColor(color: DrawerOption) {
    this.drawerOptions.stroke = color.value as string;
  }

  public setFillColor(color: DrawerOption) {
    this.drawerOptions.fill = color.value as string;
  }

  public doAction(action: DrawerAction) {
    if (action) {
      switch (action.type) {
        case DrawerActionType.FORM:
        case DrawerActionType.SHAPE:
        case DrawerActionType.TEXT:
          this.drawer = this.avalaibleDrawers.get(action.name);
          this.enableDrawingMode();
          break;
        case DrawerActionType.MISC:
          this.manageMiscActions(action);
          break;
        default:
          break;
      }
    } else {
      this.enableSelectionMode();
    }
  }

  private updateOptions(options: DrawerOption[]) {
    options.forEach((option) => {
      this.drawerOptions[option.name] = option.active
        ? option.value
        : option.initialValue;
    });
  }

  private manageMiscActions(action: DrawerAction) {
    let url: string;
    switch (action.name.toLocaleLowerCase()) {
      case 'clear':
        this.clearAllExceptForDrawMap();
        this.resetView();
        break;
      case 'download':
        this.resetView();
        url = this.canvas.toDataURL({ format: 'png', quality: 1 });
        FileSaver.saveAs(url, action.label + '.png');
        break;
      default:
        break;
    }
  }

  private clearAllExceptForDrawMap() {
    this.canvas.forEachObject((object: fabric.Object) => {
      if (object.name !== 'floor') {
        this.canvas.remove(object);
      }
    });
    this.canvas.renderAll();
    this.updateCanvasState();
  }

  private updateCanvasState() {
    const yolo = this.getCanvasState();
    this.store.dispatch(UpdateCanvas({ canvas: yolo }));
  }

  public getCanvasState(): string {
    this.updateNestedObjects();
    return this.canvas.toDatalessJSON([
      'line',
      'triangle',
      'type',
      'uid',
      'guid',
      'name',
      'selectable',
    ]);
  }

  private updateNestedObjects() {
    //   this.canvas._objects.forEach((object) => {
    //     const triangleArrow = (object as LineArrow).triangle;
    //     const lineArrow = (object as TriangleArrow).line;
    //     if (triangleArrow) {
    //       (object as LineArrow).triangle = this.getFabricObjectByUidAndType(
    //         (object as LineArrow).uid,
    //         'TriangleArrow'
    //       );
    //     } else if (lineArrow) {
    //       (object as TriangleArrow).line = this.getFabricObjectByUidAndType(
    //         (object as TriangleArrow).uid,
    //         'LineArrow'
    //       );
    //     }
    //   });
  }

  private enableSelectionMode() {
    this.canvas.hoverCursor = 'grab';
    this.canvas.moveCursor = 'grabbing';
    this.canvas.forEachObject((object) => {
      object.selectable = true;
    });
    this.readonly = false;
  }

  private enableDraggingMode() {
    this.canvas.hoverCursor = 'move';
    this.canvas.moveCursor = 'move';
    this.canvas.forEachObject((object) => (object.selectable = false));
    this.readonly = false;
  }

  private enableDrawingMode() {
    this.canvas.hoverCursor = 'crosshair';
    this.canvas.moveCursor = 'crosshair';
    this.canvas.forEachObject((object) => (object.selectable = false));
    this.readonly = false;
  }

  private enableReadOnlyMode() {
    this.canvas.hoverCursor = 'normal';
    this.canvas.moveCursor = 'normal';
    this.readonly = true;
  }

  public setDrawerOptions(option: DrawerOption) {
    if (option) {
      Object.defineProperties(this.drawerOptions, {
        [option.name]: {
          value: option.active ? option.value : option.initialValue,
          writable: false,
          configurable: true,
        },
      });
    }
  }

  public setFontFamily(font: string) {
    Object.defineProperties(this.drawerOptions, {
      ['fontFamily']: {
        value: font,
        writable: false,
        configurable: true,
      },
    });
    this.canvas.renderAll();
  }

  public setFontSize(fontSize: DrawerOption) {
    Object.defineProperties(this.drawerOptions, {
      ['fontSize']: {
        value: fontSize.value,
        writable: true,
        configurable: true,
      },
    });
    this.canvas.renderAll();
  }

  public deleteActiveObject() {
    this.canvas.getActiveObjects().forEach((obj) => {
      if (obj.name !== 'floor') {
        this.canvas.remove(obj);
      }
      if (obj.name === 'image') {
        this.store.dispatch(UnAttachImage({ imageId: obj['_id'] }));
      }
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.updateCanvasState();
  }

  public selectAllObjects() {
    const selection = new fabric.ActiveSelection(this.canvas.getObjects(), {
      canvas: this.canvas,
    });
    this.canvas.setActiveObject(selection);
    this.canvas.renderAll();
  }

  public setCanvasState(canvas: unknown): void {
    this.canvas.loadFromJSON(canvas, this.canvasStateIsLoaded.bind(this));
    this.canvas.renderAll();
  }

  public drawImage(imageUrl: string, _id: string, x: any, y: any) {
    if (_id == null) {
      fabric.util.loadImage(
        imageUrl,
        function (object: any) {
          const image = new fabric.Image(object);
          if (image) {
            const div = 50 / image.width;
            image.set({
              left: x,
              top: y,
              scaleX: div,
              scaleY: div,
              objectCaching: true,
              name: 'image',
            });
            image.setOptions({
              guid: uuid.v4(),
            });
            this.canvas.add(image);
            this.canvas.renderAll();
            this.updateCanvasState();
          } else {
            this.drawNoImage();
          }
        }.bind(this),
        {
          crossOrigin: 'anonymous',
        }
      );
    } else {
      fabric.Image.fromURL(
        imageUrl,
        function (image: any) {
          if (image._element) {
            const div = 50 / image.width;
            image.set({
              left: x,
              top: y,
              scaleX: div,
              scaleY: div,
              objectCaching: true,
              name: 'image',
              _id: _id,
              guid: uuid.v4(),
            });
            this.canvas.add(image);
            this.canvas.renderAll();
            this.updateCanvasState();
          } else {
            this.drawNoImage();
          }
        }.bind(this),
        { crossOrigin: 'Anonymous' }
      );
    }
  }

  private canvasStateIsLoaded(): void {
    this.updateNestedObjects();
    this.canvas.forEachObject((object) => {
      if (this.readonly) {
        object.selectable = false;
      }
    });
    this.canvasLoading = false;
  }

  private getFabricObjectByUidAndType(uid: string, type: string): any {
    return this.canvas._objects.find(
      (object) => (object as any).uid === uid && (object as any).name === type
    );
  }

  private initializeCanvasEvents() {
    this.canvas.on('mouse:down', (event: fabric.IEvent) => {
      if (!this.readonly) {
        this.mouseDown(event);
      }
    });

    this.canvas.on('mouse:move', (event: fabric.IEvent) => {
      if (!this.readonly) {
        this.mouseMove(event);
      }
    });

    this.canvas.on('mouse:up', () => {
      if (!this.readonly) {
        this.mouseUp();
      }
    });

    this.canvas.on('selection:created', (event: fabric.IEvent) => {
      if (!this.readonly) {
        if (this.drawingMode === DrawingMode.Selection) {
          this.selectionCreated(event);
        }
      }
    });

    this.canvas.on('object:modified', (event: fabric.IEvent) => {
      Object.defineProperties(event.target, {
        ['guid']: {
          value: uuid.v4(),
          writable: true,
          configurable: true,
        },
      });
      if (!this.readonly) {
        if (event.target instanceof fabric.Textbox) {
          this.editingText = true;
          this.drawingMode = DrawingMode.Drawing;
          this.store.dispatch(
            SetDrawingMode({ drawingMode: this.drawingMode })
          );
        }
      }
    });

    this.canvas.on('mouse:wheel', (event: fabric.IEvent) => {
      this.onMouseWheel(event);
    });
  }

  private async mouseDown(event: fabric.IEvent): Promise<void> {
    const pointer = this.canvas.getPointer(event.e);
    this.lastPosX = (event.e as any).clientX;
    this.lastPosY = (event.e as any).clientY;
    this.selectedObjects = this.canvas.getActiveObjects();
    this.isDown = true;
    if (
      this.drawingMode !== DrawingMode.Drawing ||
      this.editingText ||
      this.selectedObjects.length > 0
    ) {
      this.editingText = false;
      return;
    }
    this.objects = await this.make(pointer.x, pointer.y);
    Object.defineProperties(this.objects, {
      ['guid']: {
        value: uuid.v4(),
        writable: true,
        configurable: true,
      },
    });
    if (this.objects && this.objects.length > 0) {
      this.objects.forEach((object) => {
        this.canvas.add(object);
      });
      this.canvas.renderAll();
    }
  }

  private async mouseMove(event: fabric.IEvent): Promise<void> {
    const images = this.canvas
      .getActiveObjects()
      .filter((object) => object.name === 'image');
    if (images.length > 0) {
      this.enableSelectionMode();
    } else {
      const pointer = this.canvas.getPointer(event.e);
      if (
        this.drawer &&
        this.objects &&
        this.drawingMode === DrawingMode.Drawing &&
        this.isDown
      ) {
        this.objects.forEach((obj) => {
          this.drawer.resize(obj, pointer.x, pointer.y);
        });
      } else if (this.drawingMode === DrawingMode.Dragging && this.isDown) {
        const vpt = this.canvas.viewportTransform;
        vpt[4] += (event.e as any).clientX - this.lastPosX;
        vpt[5] += (event.e as any).clientY - this.lastPosY;
        this.lastPosX = (event.e as any).clientX;
        this.lastPosY = (event.e as any).clientY;
      }
      this.canvas.renderAll();
    }
  }

  private async mouseUp(): Promise<void> {
    this.isDown = false;
    this.canvas.setViewportTransform(this.canvas.viewportTransform);
    this.objects = [];
    this.canvas.renderAll();

    this.updateCanvasState();
  }

  private selectionCreated(event: any) {
    this.objects.push(event.selected);
    let selection: fabric.ActiveSelection;
    event.selected.forEach((selected) => {
      if (selected.name == 'LineArrow') {
        const lineArrow = selected as LineArrow;
        const triangleArrow = this.canvas
          .getObjects()
          .find(
            (obj) =>
              obj.name == 'TriangleArrow' &&
              (obj as TriangleArrow).uid == lineArrow.uid
          );

        selection = new fabric.ActiveSelection([lineArrow, triangleArrow], {
          canvas: this.canvas,
        });
      } else if (selected.name == 'TriangleArrow') {
        const triangleArrow = selected as TriangleArrow;
        const lineArrow = this.canvas
          .getObjects()
          .find(
            (obj) =>
              obj.name == 'LineArrow' &&
              (obj as LineArrow).uid == triangleArrow.uid
          );

        selection = new fabric.ActiveSelection([lineArrow, triangleArrow], {
          canvas: this.canvas,
        });
      }
    });
    if (selection) {
      this.canvas.setActiveObject(selection);
    }
    this.canvas.renderAll();
  }

  private onMouseWheel(event: fabric.IEvent) {
    const delta = (event.e as any).deltaY;
    let zoom = this.canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) {
      zoom = 20;
    }
    if (zoom < 0.3) {
      zoom = 0.3;
    }
    const pointToZoom = new fabric.Point(
      (event.e as any).offsetX,
      (event.e as any).offsetY
    );
    this.canvas.zoomToPoint(pointToZoom, zoom);
    event.e.preventDefault();
    event.e.stopPropagation();
  }

  private async make(x: number, y: number): Promise<fabric.Object[]> {
    if (this.drawer) {
      return await this.drawer.make(x, y, this.drawerOptions);
    } else {
      return null;
    }
  }

  private resizeAllObjects(newWidth) {
    if (this.canvas.width !== newWidth) {
      const scaleMultiplier = newWidth / this.canvas.width;
      const objects = this.canvas.getObjects();
      objects.forEach((object) => {
        object.scaleX = object.scaleX * scaleMultiplier;
        object.scaleY = object.scaleY * scaleMultiplier;
        object.left = object.left * scaleMultiplier;
        object.top = object.top * scaleMultiplier;
        object.setCoords();
      });

      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      this.canvas.calcOffset();
    }
  }

  private resize(width: number, height: number) {
    this.resizeAllObjects(width);
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
  }

  public resetView() {
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  }

  public close() {
    this.clear();
    this.resize(0, 0);
  }

  public clear() {
    this.canvas.clear();
    this.canvas.renderAll();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize(window.innerWidth, window.innerHeight - 92);
  }

  @HostListener('dragstart', ['$event'])
  onWindowDragStart() {
    this.cdr.detach();
  }

  @HostListener('dragend', ['$event'])
  onWindowDragEnd() {
    this.cdr.reattach();
  }

  @HostListener('drop', ['$event'])
  onwindowDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggingImage) {
      const imageUrl = this.ihs.getGalleryImage(this.draggingImage);
      this.drawImage(
        imageUrl,
        this.draggingImage._id,
        event.layerX,
        event.layerY
      );
      this.store.dispatch(AttachImage({ imageId: this.draggingImage._id }));
      this.store.dispatch(DragImageSuccess());
      this.draggingImage = null;
    }

    if (this.draggingImageLink) {
      this.drawImage(this.draggingImageLink, null, event.layerX, event.layerY);
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    switch (event.key.toLocaleLowerCase()) {
      case KEY_CODE.DELETE:
        this.deleteActiveObject();
        break;
      case KEY_CODE.ESCAPE:
        this.resetView();
        break;
      case KEY_CODE.A:
        if (this.CTRLPressed) {
          this.selectAllObjects();
          this.removeParasiteSelection();
        }
        break;
      case KEY_CODE.Z:
        if (this.CTRLPressed && !this.canvasLoading) {
          this.store.dispatch(UndoCanvasState());
        }
        break;
      case KEY_CODE.Y:
        if (this.CTRLPressed && !this.canvasLoading) {
          this.store.dispatch(RedoCanvasState());
        }
        break;
      case KEY_CODE.CTRL:
        this.CTRLPressed = false;
        break;
      default:
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    switch (event.key.toLocaleLowerCase()) {
      case KEY_CODE.CTRL:
        this.CTRLPressed = true;
        break;
    }
  }

  private removeParasiteSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    }
  }
}
