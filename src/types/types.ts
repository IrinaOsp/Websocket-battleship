export enum PlayersCommands {
  REG = "reg",
  CREATE_ROOM = "create_room",
  ADD_USER_TO_ROOM = "add_user_to_room",
  ADD_SHIPS = "add_ships",
  ATTACK = "attack",
  RANDOM_ATTACK = "randomAttack",
}

export enum ServerCommands {
  REG = "reg",
  UPDATE_ROOM = "update_room",
  UPDATE_WINNERS = "update_winners",
  CREATE_GAME = "create_game",
  START_GAME = "start_game",
  ATTACK = "attack",
  TURN = "turn",
  FINISH = "finish",
}

export interface IUser {
  name: string;
  password: string;
  id: string;
}

export interface IWinner {
  name: string;
  id: string;
  wins: number;
}

export interface IRoom {
  roomId: string;
  roomUsers: { name: string; index: string }[];
}

interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export type TypeBoard = IShip[];

interface IPlayer {
  id: string;
  board: TypeBoard | [];
}

export interface IGame {
  idGame: string;
  players: IPlayer[];
  currentPlayer: string;
}

export type TypeAttackStatus = "miss" | "killed" | "shot";
