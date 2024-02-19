import WebSocket from "ws";
import { PlayersCommands } from "../../types/types";
import { Users } from "../Users/usersDB";
import { regConfirmation, updateWinners } from "./outgoingCommands";

export const addUser = (userData: unknown, ws: WebSocket) => {
  if (typeof userData !== "string") {
    return null;
  } else {
    try {
      const data = JSON.parse(userData);
      Users.push(data);
      if (ws instanceof WebSocket) {
        regConfirmation(data.name, data.id, ws);
        updateWinners(data.name, ws);
      }
    } catch (error) {
      if (ws instanceof WebSocket) {
        ws.send(
          JSON.stringify({
            type: PlayersCommands.REG,
            data: JSON.stringify({ error: true, errorText: error }),
            id: 0,
          })
        );
      }
    }
  }
};

export const createRoom = (data: unknown, ws: WebSocket) => {
  if (typeof data !== "string") {
    return null;
  } else {
    try {
      const roomData = JSON.parse(data);
      if (typeof roomData === "string" && ws instanceof WebSocket) {
        ws.send(
          JSON.stringify({
            type: PlayersCommands.CREATE_ROOM,
            data: JSON.stringify({ error: false, errorText: "" }),
            id: 0,
          })
        );
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "createRoom error"
      );
    }
  }
};
