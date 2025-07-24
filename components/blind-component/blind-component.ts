import {Component, Input, output, Output} from '@angular/core';
import {Game} from '../../models';
import {PlayerService} from '../../services/player-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-blind-component',
  imports: [
    FormsModule
  ],
  templateUrl: './blind-component.html',
  styleUrl: './blind-component.scss'
})
export class BlindComponent {
  bigBlind: number = 50;
  averageStack: number = 0;

  initialStack: number = 1000;
  @Input() game!: Game;
  blindsReady = output<void>();

  constructor(private playerService: PlayerService) {
    this.playerService.players.subscribe(players => {
      const numberOfPlayers = players.filter(p => p.s.state !== "EMPTY").length;
      const numberOfActivePlayers = players.filter(p => p.s.state === "PLAYING").length;
      this.averageStack = (this.initialStack * numberOfPlayers) / numberOfActivePlayers;
    });
  }

  public increaseBlinds() {
    this.bigBlind *= 2;
  }

  public setBlinds() {
    console.log('setBlinds');
    this.blindsReady.emit();
  }

  protected readonly Math = Math;
}
