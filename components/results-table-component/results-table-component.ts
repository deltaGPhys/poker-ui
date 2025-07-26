import { Component } from '@angular/core';
import {PlayerService} from '../../services/player-service';
import {Player} from '../../models';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-results-table-component',
  imports: [
    NgClass
  ],
  templateUrl: './results-table-component.html',
  styleUrl: './results-table-component.scss'
})
export class ResultsTableComponent {
  players!: Player[];

  constructor(private playerService: PlayerService) {
    this.playerService.players.subscribe(p =>
      this.players = p.filter( p => p.s.state === "COMPLETE")
        .sort((a,b) => (a.s.state === "COMPLETE" && b.s.state === "COMPLETE") ? a.s.finalRank > b.s.finalRank ? 1 : -1 : -1));
  }
}
