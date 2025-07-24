import { Component } from '@angular/core';
import {PlayerDashboardComponent} from '../player-dashboard/player-dashboard';
import {PlayerService} from '../../services/player-service';
import {Game, Player} from '../../models';
import {BlindComponent} from '../blind-component/blind-component';
import {ResultsTableComponent} from '../results-table-component/results-table-component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [PlayerDashboardComponent, BlindComponent, ResultsTableComponent],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class TableComponent {

  players: Player[] = [];
  activePlayerCount: number = 0;
  game: Game = new Game();

  constructor(private playerService: PlayerService) {
    this.playerService.players.subscribe(p => {
      this.players = p;
      this.activePlayerCount = this.players.filter(player => player.s.state === "SEATED").length;
      if (this.players.filter(player => player.s.state === "PLAYING").length === 0 && this.game.s.state === "PLAYING") {
        this.finishGame();
      }
    });
  }

  ngOnInit() {
    this.playerService.initPlayers(10);
  }

  enterButtonPhase() {
    this.game.buttonPhase();
  }

  enterBlindPhase(player: Player) {
    console.log(player);
    this.playerService.assignButton(player);
    this.game.blindPhase();
  }

  startGame() {
    console.log('sdasd');
    this.playerService.startGame(this.players[0]);
    this.game.startPlay();
  }

  nextHand() {
    this.playerService.moveButton();
  }

  finishGame() {
    this.game.finishGame();
  }
}
