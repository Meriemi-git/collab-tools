import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Gadget, GadgetType } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';
import { ConfirmationService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'collab-tools-add-gadget',
  templateUrl: './add-gadget.component.html',
})
export class AddGadgetComponent implements OnChanges {
  @Input() gadget: Gadget;
  @Output() gadgetAdded = new EventEmitter<FormData>();
  @Output() gadgetUpdated = new EventEmitter<FormData>();
  @Output() gadgetDeleted = new EventEmitter<string>();

  @ViewChild('fileUpload')
  public fileUpload: FileUpload;
  public file: File;
  public image: string;
  public types: GadgetType[] = [GadgetType.COMMON, GadgetType.PERSONAL];
  public gadgetForm = this.formBuilder.group({
    gadgetName: new FormControl('', [Validators.required]),
    gadgetType: new FormControl('', [Validators.required]),
  });

  constructor(
    public readonly ihs: ImageHelperService,
    private readonly confirmationService: ConfirmationService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.gadget) {
      this.gadgetForm.patchValue({
        gadgetName: this.gadget.name,
        gadgetType: this.gadget.type,
      });
    }
  }

  public onSubmit() {
    if (this.gadgetForm.valid) {
      const formData = new FormData();
      if (this.file) {
        formData.set('image', this.file);
      }
      const gadget: Gadget = {
        _id: this.gadget?._id,
        name: this.gadgetForm.get('gadgetName').value ?? this.gadget.name,
        type: this.gadgetForm.get('gadgetType').value ?? this.gadget.type,
        image: null,
      };
      formData.set('gadget', JSON.stringify(gadget));
      if (this.gadget && this.gadget._id !== null) {
        this.gadgetUpdated.emit(formData);
      } else {
        this.gadgetAdded.emit(formData);
      }
    }
  }

  public onImageUploaded(images: File[]): void {
    this.file = images[0];
  }

  public onDelete() {
    if (this.gadget && this.gadget._id) {
      this.confirmationService.confirm({
        icon: 'pi pi-exclamation-triangle',
        key: 'delete-gadget-confirmation',
        accept: () => {
          this.gadgetDeleted.emit(this.gadget._id);
          this.clearGadget();
        },
      });
    }
  }

  public removeImage() {
    if (this.gadget) {
      this.fileUpload.clear();
      this.image = null;
    }
  }

  public clearGadget() {
    this.gadget = null;
    this.gadgetForm.patchValue({
      gadgetName: null,
      gadgetType: null,
    });
    this.image = null;
    this.file = null;
  }
}
