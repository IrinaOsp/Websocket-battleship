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
}

export interface IWinner {
  name: string;
  wins: number;
}
