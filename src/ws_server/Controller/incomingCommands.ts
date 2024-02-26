import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IRoom, IUser, PlayersCommands } from "../../types/types";
import { Users, getUser } from "../Users/usersDB";
import {
  createGame,
  regConfirmation,
  updateRoom,
  updateWinners,
} from "./outgoingCommands";
import { roomsList } from "../Room";
import { WSConnections } from "../Connections/ws-connection";

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
      return data.name;
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

export const createRoom = (ws: WebSocket, id: string) => {
  console.log("start createRoom");
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

export const addUserToRoom = (data: unknown, ws: WebSocket, id: string) => {
  if (typeof data !== "string") {
    return null;
  } else {
    try {
      const { indexRoom } = JSON.parse(data);
      const room = roomsList.find((room) => room.roomId === indexRoom);
      if (room) {
        room.roomUsers.push({ name: getUser(id)?.name || "", index: id });
        updateRoom();
        createGame(indexRoom);
      }
    } catch (error) {
      console.log(error);
    }
  }
};
