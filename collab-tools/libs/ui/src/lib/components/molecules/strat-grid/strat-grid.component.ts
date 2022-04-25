import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Like, Strat, UserDto } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-strat-grid',
  templateUrl: './strat-grid.component.html',
  styleUrls: ['./strat-grid.component.scss'],
})
export class StratGridComponent {
  @Input() strats: Strat[];
  @Input() likes: Like[];
  @Input() userInfos: UserDto;
  @Output() selectStrat = new EventEmitter<Strat>();
  @Output() deleteStrat = new EventEmitter<Strat>();
  @Output() likeStrat = new EventEmitter<Strat>();
  @Output() dislikeStrat = new EventEmitter<Strat>();
  @Output() removeFavorite = new EventEmitter<Strat>();

  public onLikeStrat(strat: Strat) {
    this.likeStrat.emit(strat);
  }

  public onDislikeStrat(strat: Strat) {
    this.dislikeStrat.emit(strat);
  }

  public stratIsLiked(strat: Strat): boolean {
    return this.likes.some((like) => like.stratId === strat._id);
  }

  public isItMine(strat: Strat): boolean {
    return this.userInfos?._id === strat.userId;
  }

  public onSelectStrat(strat: Strat) {
    this.selectStrat.emit(strat);
  }
}
