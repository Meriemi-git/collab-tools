import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoomInfos } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-room-joiner',
  templateUrl: './room-joiner.component.html',
  styleUrls: ['./room-joiner.component.scss'],
})
export class RoomJoinerComponent implements OnInit {
  @Input() roomId: string;
  @Output()
  public joinRoom = new EventEmitter<RoomInfos>();
  public formSubmitted: boolean;
  public existingRoomForm = new FormGroup({
    roomId: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  ngOnInit(): void {
    this.existingRoomForm.get('password').setValue('P@ssw0rd');
  }

  public get formControls() {
    return this.existingRoomForm.controls;
  }

  public onJoinRoom() {
    this.formSubmitted = true;
    if (this.existingRoomForm.valid) {
      const roomInfos = {
        id: this.existingRoomForm.get('roomId').value,
        password: this.existingRoomForm.get('password').value,
      };
      this.joinRoom.emit(roomInfos);
    }
  }
}
