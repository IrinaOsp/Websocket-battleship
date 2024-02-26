import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IRoom, IUser, PlayersCommands } from "../../types/types";
import { Users, getUser } from "../Users/usersDB";
import {
  attackMessage,
  createGame,
  finish,
  regConfirmation,
  startGame,
  turn,
  updateRoom,
  updateWinners,
} from "./outgoingCommands";
import { roomsList } from "../Room";
import { WSConnections } from "../Connections/ws-connection";
import { Games } from "../Games/games";
import {
  Boards,
  checkAttack,
  checkIfFinal,
  createBoard,
} from "../Boards/boards";

export const regUser = (userData: unknown, ws: WebSocket, id: string) => {
  if (typeof userData !== "string") {
    return null;
  } else {
    try {
      const data = JSON.parse(userData);
      if (Users.find((user) => user.name === data.name)) {
        ws.send(
          JSON.stringify({
            type: PlayersCommands.REG,
            data: JSON.stringify({
              error: true,
              errorText: "User exists",
              name: data.name,
              id,
            }),
            id: 0,
          })
        );
        throw new Error("User with this name already exists");
      }
      const user: IUser = {
        name: data.name,
        password: data.password,
        id,
      };
      Users.push(user);
      WSConnections[id] = ws;
      regConfirmation(data.name, id, ws);
      updateRoom();
      updateWinners();
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: PlayersCommands.REG,
          data: JSON.stringify({ error: true, errorText: error }),
          id: 0,
        })
      );
    }
  }
};

export const createRoom = (id: string) => {
  try {
    const room: IRoom = {
      roomId: uuidv4(),
      roomUsers: [{ name: getUser(id)?.name || "", index: id }],
    };
    roomsList.push(room);
    updateRoom();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "createRoom error"
    );
  }
};

export const addUserToRoom = (data: unknown, id: string) => {
  if (typeof data !== "string") {
    return null;
  } else {
    try {
      const { indexRoom } = JSON.parse(data);
      const room = roomsList.find((room) => room.roomId === indexRoom);
      if (!room) {
        throw new Error(`Room with id ${indexRoom} not found`);
      }
      room.roomUsers.push({ name: getUser(id)?.name || "", index: id });
      createGame(indexRoom);
      updateRoom();
    } catch (error) {
      console.log(error);
    }
  }
};

export const addShips = (data: string) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data);
  const game = Games.find((game) => game.idGame === gameId);
  if (game) {
    const player = game.players.find((player) => player.id === indexPlayer);
    if (!player) {
      return null;
    }
    player.board = ships;
    createBoard(ships, player.id);
    const boardsQuantity: number = game.players.reduce(
      (acc, player) => (player.board.length > 0 ? acc + 1 : acc),
      0
    );
    if (boardsQuantity === 2) {
      game.players.forEach((player) => {
        startGame(player.id, game);
      });
      turn(game);
    }
  }
};

export const attack = (data: string) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const game = Games.find((game) => game.idGame === gameId);
  if (!game) {
    throw new Error("Game not found");
  }
  if (indexPlayer !== game.currentPlayer) {
    throw new Error("It's not your turn");
  }
  const IndexEnemy = game.players.find(
    (player) => player.id !== indexPlayer
  )?.id;
  const enemyBoard = Boards.get(IndexEnemy!);
  if (!enemyBoard || !IndexEnemy) {
    throw new Error("Enemy or enemy board not found");
  }
  const status = checkAttack(enemyBoard, x, y);
  console.log(status);
  if (status === "killed") {
    const isFinal = checkIfFinal(enemyBoard);
    if (isFinal) {
      finish(game, indexPlayer);
      return;
    }
  }

  attackMessage(x, y, game, status, IndexEnemy);
};

export const randomeAttack = (data: string) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  attack(
    JSON.stringify({
      gameId,
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      indexPlayer,
    })
  );
};
