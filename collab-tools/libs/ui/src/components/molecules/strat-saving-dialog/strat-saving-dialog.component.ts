import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface StratInfosDialogData {
  name: string;
  description: string;
  isPublic: boolean;
}

@Component({
  selector: 'collab-tools-strat-saving-modal',
  templateUrl: './strat-saving-dialog.component.html',
  styleUrls: ['./strat-saving-dialog.component.scss'],
})
export class StratSavingDialogComponent implements OnInit {
  @Input() position: string;
  @Input() visible: boolean;
  stratInfos: StratInfosDialogData;

  public isSubmitted = false;

  public stratForm: FormGroup;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.stratInfos = {
      name: this.config.data.name,
      description: this.config.data.description,
      isPublic: this.config.data.isPublic,
    };
    this.stratForm = this.formBuilder.group({
      name: new FormControl(this.stratInfos.name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(this.stratInfos.description),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.stratForm.valid) {
      this.isSubmitted = false;
      this.stratInfos.name = this.stratForm.get('name').value;
      this.stratInfos.description = this.stratForm.get('description').value;
      this.dialogRef.close(this.stratInfos);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  get fc() {
    return this.stratForm.controls;
  }
}
