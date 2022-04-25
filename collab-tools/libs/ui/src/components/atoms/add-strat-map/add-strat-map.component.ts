import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Floor, StratMap } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';
import { ConfirmationService } from 'primeng/api';
import { FloorListComponent } from '../floor-list/floor-list.component';

@Component({
  selector: 'collab-tools-add-strat-map',
  templateUrl: './add-strat-map.component.html',
  styleUrls: ['./add-strat-map.component.scss'],
})
export class AddStratMapComponent implements OnChanges {
  @Input()
  public selectedStratMap: StratMap;
  @Input()
  public selectedFloor: Floor;
  @Output()
  public stratMapAdded = new EventEmitter<FormData>();
  @Output()
  public stratMapUpdated = new EventEmitter<FormData>();
  @Output()
  public stratMapDeleted = new EventEmitter<string>();
  @Output()
  public floorAdded = new EventEmitter<FormData>();
  @Output()
  public floorUpdated = new EventEmitter<FormData>();
  @Output()
  public floorDeleted = new EventEmitter<string>();

  @ViewChild('floorList')
  public floorList: FloorListComponent;

  public file: File;

  public step: number;

  public stratMapForm = new FormGroup({
    mapName: new FormControl('', [Validators.required]),
    mapYear: new FormControl('', [Validators.required]),
    mapSeason: new FormControl('', [Validators.required]),
  });

  constructor(
    public readonly ihs: ImageHelperService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedStratMap) {
      this.stratMapForm.patchValue({
        mapName: this.selectedStratMap.name,
        mapYear: this.selectedStratMap.year,
        mapSeason: this.selectedStratMap.season,
      });
      this.step = 0;
    }
    if (changes['selectedFloor']) {
      this.step = 1;
    }
  }

  submit() {
    const formData = new FormData();
    const floors = this.floorList?.getUpdatedFloors() ?? [];
    if (this.file) {
      formData.set('image', this.file);
    }
    const stratMap: StratMap = {
      _id: this.selectedStratMap?._id,
      name:
        this.stratMapForm.get('mapName').value ?? this.selectedStratMap.name,
      season:
        this.stratMapForm.get('mapYear').value ?? this.selectedStratMap.season,
      year:
        this.stratMapForm.get('mapSeason').value ?? this.selectedStratMap.year,
      image: this.selectedStratMap.image,
      floors: floors,
    };
    formData.set('map', JSON.stringify(stratMap));
    if (this.selectedStratMap && this.selectedStratMap._id !== null) {
      this.stratMapUpdated.emit(formData);
    } else {
      this.stratMapAdded.emit(formData);
    }
  }

  delete() {
    if (this.selectedStratMap && this.selectedStratMap._id) {
      this.confirmationService.confirm({
        icon: 'pi pi-exclamation-triangle',
        key: 'delete-strat-map-confirmation',
        accept: () => {
          this.stratMapDeleted.emit(this.selectedStratMap._id);
          this.clearMap();
        },
      });
    }
  }

  removeMapImage() {
    this.file = null;
  }

  public setStep(step: number) {
    this.step = step;
  }

  public onFloorAdded(data: FormData) {
    this.floorAdded.emit(data);
    this.selectedFloor = null;
  }

  public onFloorDeleted(floor: Floor) {
    this.floorDeleted.emit(floor._id);
    this.selectedFloor = null;
  }

  public onFloorUpdated(data: FormData) {
    this.floorUpdated.emit(data);
    this.selectedFloor = null;
  }

  public onFloorSelected(floor: Floor) {
    this.selectedFloor = floor;
  }

  public onImageUploaded(file: File) {
    this.file = file;
  }

  public clearMap() {
    this.selectedStratMap = null;
    this.selectedFloor = null;
    this.stratMapForm.patchValue({
      mapName: null,
      mapYear: null,
      mapSeason: null,
    });
    this.file = null;
  }
}
