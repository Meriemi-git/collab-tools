import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Floor } from '@collab-tools/datamodel';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'collab-tools-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss'],
})
export class AddFloorComponent implements OnChanges {
  @Input() selectedFloor: Floor;
  @Output() floorAdded = new EventEmitter<FormData>();
  @Output() floorUpdated = new EventEmitter<FormData>();
  @Output() floorDeleted = new EventEmitter<Floor>();

  @ViewChild('fileRealisticUpload')
  public fileRealisticUpload: FileUpload;
  @ViewChild('fileTacticalUpload')
  public fileTacticalUpload: FileUpload;

  public newFloorName: string;
  public newFloorLevel: number;
  public isValid: boolean;
  public tacticalImage: File;
  public realisticImage: File;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.selectedFloor) {
      this.newFloorName = this.selectedFloor.name;
      this.newFloorLevel = this.selectedFloor.level;
      this.isValid = this.selectedFloor.isValid;
    } else {
      this.newFloorName = null;
      this.newFloorLevel = null;
      this.isValid = null;
    }
  }

  public toogleNewFloorDeprecated(isValid: boolean) {
    this.isValid = isValid;
  }

  public onRealisticImageUploaded(files: File[]) {
    this.realisticImage = files[0];
  }

  public onTacticalImageUploaded(files: File[]) {
    this.tacticalImage = files[0];
  }

  addFloor() {
    const formdata = new FormData();
    let floor: Floor;
    if (this.tacticalImage) {
      formdata.append('images', this.tacticalImage, 'tactical.png');
    }
    if (this.realisticImage) {
      formdata.append('images', this.realisticImage, 'realistic.png');
    }
    if (this.selectedFloor) {
      floor = {
        _id: this.selectedFloor._id,
        name: this.newFloorName ?? this.selectedFloor.name,
        level: this.newFloorLevel ?? this.selectedFloor.level,
        isValid: this.isValid,
        image_realistic: null,
        image_tactical: null,
      };
      formdata.set('floor', JSON.stringify(floor));
      this.floorUpdated.emit(formdata);
    } else {
      floor = {
        name: this.newFloorName,
        level: this.newFloorLevel,
        isValid: this.isValid,
        image_realistic: null,
        image_tactical: null,
      };
      formdata.set('floor', JSON.stringify(floor));
      this.floorAdded.emit(formdata);
    }
  }

  public removeTacticalImage() {
    this.fileTacticalUpload.clear();
    this.tacticalImage = null;
  }

  public removeRealisticImage() {
    this.fileRealisticUpload.clear();
    this.realisticImage = null;
  }

  public deleteFloor() {
    this.floorDeleted.emit(this.selectedFloor);
  }
}
