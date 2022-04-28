import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Draw, Like, UserDto } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-draw-grid',
  templateUrl: './draw-grid.component.html',
  styleUrls: ['./draw-grid.component.scss'],
})
export class DrawGridComponent {
  @Input() draws: Draw[];
  @Input() likes: Like[];
  @Input() userInfos: UserDto;
  @Output() selectDraw = new EventEmitter<Draw>();
  @Output() deleteDraw = new EventEmitter<Draw>();
  @Output() likeDraw = new EventEmitter<Draw>();
  @Output() dislikeDraw = new EventEmitter<Draw>();
  @Output() removeFavorite = new EventEmitter<Draw>();

  public onLikeDraw(draw: Draw) {
    this.likeDraw.emit(draw);
  }

  public onDislikeDraw(draw: Draw) {
    this.dislikeDraw.emit(draw);
  }

  public drawIsLiked(draw: Draw): boolean {
    return this.likes.some((like) => like.drawId === draw._id);
  }

  public isItMine(draw: Draw): boolean {
    return this.userInfos?._id === draw.userId;
  }

  public onSelectDraw(draw: Draw) {
    this.selectDraw.emit(draw);
  }
}
