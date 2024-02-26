import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { PlayersCommands } from "../types/types";
import {
  regUser,
  addUserToRoom,
  createRoom,
} from "./Controller/incomingCommands";

const WS_PORT = 3000;
export const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on("listening", () => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
});

const id = uuidv4();

wsServer
  .on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    ws.on("message", (message) => {
      try {
        const { type, data } = JSON.parse(message.toString());
        switch (type) {
          case PlayersCommands.REG: {
            regUser(data, ws, id);
            break;
          }
          case PlayersCommands.CREATE_ROOM: {
            createRoom(ws, id);
            break;
          }
          case PlayersCommands.ADD_USER_TO_ROOM: {
            addUserToRoom(data, ws, id);
            break;
          }
          default: {
            console.log("Unknown command");
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("close", () => {
    console.log("Server closed");
  });
