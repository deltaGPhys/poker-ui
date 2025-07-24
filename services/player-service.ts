import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Player} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  players = new BehaviorSubject<Player[]>([]);

  constructor() {
  }

  public initPlayers(n: number) {
    const playerSet = [];
    for (let i = 0; i < n; i++) {
      playerSet.push(new Player(i));
    }
    this.players.next(playerSet);
  }

  public startGame(button: Player) {
    let currentPlayers = this.players.getValue();
    currentPlayers.forEach(player => {
      if(player.s.state === "SEATED") {
        player.startPlay();
      }
    });
    this.players.next(currentPlayers);
  }

  public bustPlayer(player: Player) {
    let currentPlayers = this.players.getValue();
    let remainingPlayers = currentPlayers.filter(p => p.s.state === "PLAYING").length;
    player.bust(remainingPlayers);
    if (remainingPlayers === 2) {
      let finalPlayer = currentPlayers.find(p => p.s.state === "PLAYING");
      // @ts-ignore
      finalPlayer.win();
    }
    this.players.next(currentPlayers);
  }

  public sitPlayer(player: Player, name: string) {
    player.sit(name);
    this.players.next(this.players.getValue());
  }

  public assignButton(button: Player) {
    const currentPlayers = this.players.getValue();
    const activePlayers = currentPlayers.filter(p => p.s.state === "SEATED");
    const index = activePlayers.findIndex(p => p.s.location.number === button.s.location.number);
    if (button.s.state === "SEATED") { //TODO: these type checks can't be the right way to do this
      if (activePlayers.length > 2) {
        button.s.position = "BUTTON";
      } else {
        button.s.position = "BUTTON-SMALL_BLIND";
      }
    }
    const smallBlind = activePlayers[(index + 1) % activePlayers.length];
    if (smallBlind.s.state === "SEATED") {
      if (activePlayers.length > 2) {
        smallBlind.s.position = "SMALL_BLIND";
      } else {
        smallBlind.s.position = "BIG_BLIND";
      }
    }
    const bigBlind = activePlayers[(index + 2) % activePlayers.length];
    if (bigBlind.s.state === "SEATED") {
      if (activePlayers.length > 2) {
        bigBlind.s.position = "BIG_BLIND";
      }
    }
    this.players.next(currentPlayers);
  }

  public moveButton() {
    const players = this.players.getValue();
    const seatedPlayers = this.players.getValue().filter(p => p.s.state === "COMPLETE" || p.s.state === "PLAYING");
    // current BB -> SB
    const bbPlayerIndex = seatedPlayers.findIndex(p => (p.s.state === "COMPLETE" || p.s.state === "PLAYING") && p.s.position === "BIG_BLIND");
    const sbPlayerIndex = seatedPlayers.findIndex(p => (p.s.state === "COMPLETE" || p.s.state === "PLAYING") && p.s.position === "SMALL_BLIND");
    const buttonPlayerIndex = seatedPlayers.findIndex(p => (p.s.state === "COMPLETE" || p.s.state === "PLAYING") && p.s.position === "BUTTON");

    const bbPlayer = seatedPlayers[bbPlayerIndex];
    if (bbPlayer && "position" in bbPlayer.s) {
      if (players.filter(p => p.s.state === "PLAYING").length > 2) {
        bbPlayer.s.position = "SMALL_BLIND";
      } else {
        bbPlayer.s.position = "BUTTON-SMALL_BLIND";
      }

    }
    // current SB -> button
    const sbPlayer = seatedPlayers[sbPlayerIndex];
    if (sbPlayer && "position" in sbPlayer.s) {
      sbPlayer.s.position = "BUTTON";
    }
    // current button -> null
    const buttonPlayer = seatedPlayers[buttonPlayerIndex];
    if (buttonPlayer && "position" in buttonPlayer.s) {
      buttonPlayer.s.position = null;
    }
    // BB -> next active player after current BB (now, the SB)
    for (let i = 1; i <= seatedPlayers.length; i++) {
      const player = seatedPlayers[(bbPlayerIndex + i) % seatedPlayers.length];
      if (player.s.state === "PLAYING") {
        player.s.position = "BIG_BLIND";
        break;
      }
    }
    this.players.next(players);
  }

  // top betting line: 30%
  // bottom betting line: 70%
  // left inside: 17%
  // right inside: 83%
  // left top curve start: 30% top/28% left
  // right top curve start: 30% top/72% left
  // left bottom curve start: 70% top/28% left
  // right bottom curve start: 70% top/72% left
  //
  // rectangle: 44% long, 40% tall
  // ends: 20% radius, center at 50%,17%/83%
  // perimeter: 214%
  // thresholds: 22%, 85%, 129%, 192%

  public static linearToPos(s: number) {
    // top rail: < 22%
    if (s <= 22) {
      return [50 + s, 30];
    }
    // top rail: > 192%
    else if (s >= 192) {
      return [(s - 192) + 28, 30];
    }
    // right curve: > 22, < 85
    else if (s > 22 && s < 85) {
      const c_x = 72;
      const c_y = 50;
      const r = 20;
      const s_relative = s - 22;
      const angle = s_relative / r;
      const x = c_x + r * Math.sin(angle);
      const y = c_y - r * Math.cos(angle);
      return [x,y];
    }
    // bottom rail: > 85, < 129
    else if (s >= 85 && s <= 129) {
      return [107 + 50 - s, 70];
    }
    // left curve: > 129, < 192
    else if (s > 129 && s < 192) {
      const c_x = 28;
      const c_y = 50;
      const r = 20;
      const s_relative = s - 129;
      const angle = s_relative / r;
      const x = c_x - r * Math.sin(angle);
      const y = c_y + r * Math.cos(angle);
      return [x,y];
    }
    else {
      return [0,0];
    }
  }


}
