import {
  Component,
  HostListener,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Image, UserDto } from '@collab-tools/datamodel';
import {
  DeleteGalleryImage,
  DragImage,
  DragImageLink,
  DragImageSuccess,
  getDraggedImage,
  getGalleryImages,
  GetGalleryImages,
  getUserInfos,
  StratEditorState,
  UploadGalleryImage,
} from '@collab-tools/store';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-gallery-panel',
  templateUrl: './gallery-panel.component.html',
  styleUrls: ['./gallery-panel.component.scss'],
})
export class GalleryPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $images: Observable<Image[]>;
  public $userInfos: Observable<UserDto>;
  public $draggingImage: Observable<Image>;
  public selectionForDeletion: Image[];
  public imageLink: string;

  @ViewChild('fileUploader')
  public fileUploader: FileUpload;

  public fileName: string;

  constructor(
    private readonly store: Store<StratEditorState>,
    private readonly domSanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.$images = this.store
      .select(getGalleryImages)
      .pipe(takeUntil(this.unsubscriber));
    this.$userInfos = this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber));
    this.$draggingImage = this.store
      .select(getDraggedImage)
      .pipe(takeUntil(this.unsubscriber));
    this.store.dispatch(GetGalleryImages());
  }

  public onImageUploaded(images: File[]): void {
    this.store.dispatch(UploadGalleryImage({ image: images[0] }));
    this.fileUploader.clear();
    this.fileName = null;
  }

  public onImageDragged(image: Image) {
    this.store.dispatch(DragImage({ image }));
  }
  public imageDeleted(deleted: Image) {
    this.store.dispatch(DeleteGalleryImage({ deleted }));
  }

  public onUrlImageLoaded() {
    const link = this.domSanitizer.sanitize(
      SecurityContext.URL,
      this.imageLink
    );
    this.store.dispatch(DragImageLink({ link }));
  }

  public onSelect(files: File[]) {
    const filenameLength = files[0].name.lastIndexOf('.');
    if (filenameLength > 20) {
      const fileExtension = files[0].name.substring(filenameLength);
      this.fileName = `${files[0].name.substring(0, 20)}[...]${fileExtension}`;
    } else {
      this.fileName = files[0].name;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.store.dispatch(DragImageSuccess());
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: Event) {
    event.preventDefault();
  }
}
