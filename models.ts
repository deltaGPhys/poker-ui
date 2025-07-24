import {PlayerService} from './services/player-service';

export class PlayerLocation {
  x: number;
  y: number;
  s: number;
  number: number;

  constructor(n: number) {
    this.s = 214 * n/10;
    const positions = PlayerService.linearToPos(this.s);
    this.x = positions[0];
    this.y = positions[1];
    this.number = n;
  }
}

export type PlayerState =
  | {state: "EMPTY", location: PlayerLocation}
  | {state: "SEATED", location: PlayerLocation, name: string, position: "BUTTON" | "BIG_BLIND" | "SMALL_BLIND" | "BUTTON-SMALL_BLIND" | null}
  | {state: "PLAYING", location: PlayerLocation, name: string, position: "BUTTON" | "BIG_BLIND" | "SMALL_BLIND" | "BUTTON-SMALL_BLIND" | null}
  | {state: "COMPLETE", location: PlayerLocation, name: string, finalRank: number, position: "BUTTON" | "BIG_BLIND" | "SMALL_BLIND" | "BUTTON-SMALL_BLIND" | null}

// sit (name) (EMPTY -> SEATED)
// startPlay() (SEATED -> PLAYING)
// bust(rank) (PLAYING -> COMPLETE)
// shift() (PLAYING -> PLAYING or COMPLETE -> COMPLETE)
// win() (PLAYING -> COMPLETE)

export class Player {
  s: PlayerState;

  constructor(n: number) {
    this.s = {state: "EMPTY", location: new PlayerLocation(n)}
  }

  public sit(name: string) {
    if (this.s.state === "EMPTY") {
      this.s = {state: "SEATED", location: this.s.location, name: name, position: null};
    }
    else {
      throw new Error(`Illegal state transition: sit/${this.s.state}`)
    }
  }

  public startPlay() {
    if (this.s.state === "SEATED") {
      this.s = {state: "PLAYING", location: this.s.location, name: this.s.name, position: this.s.position};
    }
    else {
      throw new Error(`Illegal state transition: startPlay/${this.s.state}`)
    }
  }

  public bust(finalRank: number) {
    if (this.s.state === "PLAYING") {
      this.s = {state: "COMPLETE", location: this.s.location, name: this.s.name, position: this.s.position, finalRank: finalRank};
    }
    else {
      throw new Error(`Illegal state transition: bust/${this.s.state}`)
    }
  }

  public win() {
    if (this.s.state === "PLAYING") {
      this.s = {state: "COMPLETE", location: this.s.location, name: this.s.name, position: this.s.position, finalRank: 1};
    }
    else {
      throw new Error(`Illegal state transition: win/${this.s.state}`)
    }
  }

}


export type GameState =
  | {state: "SETUP"}
  | {state: "CHOOSE_BUTTON"}
  | {state: "SET_BLINDS"}
  | {state: "PLAYING"}
  | {state: "COMPLETE"}

export class Game {
  s: GameState = {state: "SETUP"};

  public buttonPhase() {
    this.s = {state: "CHOOSE_BUTTON"};
  }

  public blindPhase() {
    this.s = {state: "SET_BLINDS"};
  }

  public startPlay() {
    this.s = {state: "PLAYING"};
  }

  public finishGame() {
    this.s = {state: "COMPLETE"};
  }
}
