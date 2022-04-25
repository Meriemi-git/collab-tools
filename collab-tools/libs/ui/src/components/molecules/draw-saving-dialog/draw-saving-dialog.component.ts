import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface DrawInfosDialogData {
  name: string;
  description: string;
  isPublic: boolean;
}

@Component({
  selector: 'collab-tools-draw-saving-modal',
  templateUrl: './draw-saving-dialog.component.html',
  styleUrls: ['./draw-saving-dialog.component.scss'],
})
export class DrawSavingDialogComponent implements OnInit {
  @Input() position: string;
  @Input() visible: boolean;
  drawInfos: DrawInfosDialogData;

  public isSubmitted = false;

  public drawForm: FormGroup;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.drawInfos = {
      name: this.config.data.name,
      description: this.config.data.description,
      isPublic: this.config.data.isPublic,
    };
    this.drawForm = this.formBuilder.group({
      name: new FormControl(this.drawInfos.name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(this.drawInfos.description),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.drawForm.valid) {
      this.isSubmitted = false;
      this.drawInfos.name = this.drawForm.get('name').value;
      this.drawInfos.description = this.drawForm.get('description').value;
      this.dialogRef.close(this.drawInfos);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  get fc() {
    return this.drawForm.controls;
  }
}
