import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IRoom, IUser, PlayersCommands } from "../../types/types";
import { Users, getUser } from "../Users/usersDB";
import {
  createGame,
  regConfirmation,
  startGame,
  updateRoom,
  updateWinners,
} from "./outgoingCommands";
import { roomsList } from "../Room";
import { WSConnections } from "../Connections/ws-connection";
import { Games } from "../Games/games";

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
    const boardsQuantity: number = game.players.reduce(
      (acc, player) => (player.board.length > 0 ? acc + 1 : acc),
      0
    );
    if (boardsQuantity === 2) {
      game.players.forEach((player) => {
        startGame(player.id, game);
      });
    }
  }
};
