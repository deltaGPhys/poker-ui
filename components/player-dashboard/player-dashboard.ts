import {Component, Input, output} from '@angular/core';
import {Game, Player} from '../../models';
import {AddPlayerComponent} from '../add-player-component/add-player-component';
import {NgClass} from '@angular/common';
import {PlayerService} from '../../services/player-service';

@Component({
  selector: 'app-player-dashboard',
  imports: [
    AddPlayerComponent,
    NgClass
  ],
  templateUrl: './player-dashboard.html',
  styleUrl: './player-dashboard.scss'
})
export class PlayerDashboardComponent {
  width = 100;
  height = 50;

  @Input() player!: Player;
  @Input() game!: Game;
  buttonChosen = output<Player>();

  constructor(private playerService: PlayerService) {}

  public bustPlayer() {
    this.playerService.bustPlayer(this.player);
  }

  public chooseButton() {
    if (this.game.s.state === "CHOOSE_BUTTON") {
      this.buttonChosen.emit(this.player);
    }
  }
}
