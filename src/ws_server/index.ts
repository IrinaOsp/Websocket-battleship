import { WebSocketServer } from "ws";
import { PlayersCommands } from "../types/types";
import { addUser, createRoom } from "./Controller/incomingCommands";

const WS_PORT = 3000;
export const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on("listening", () => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
});

wsServer
  .on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
      try {
        const { type, data } = JSON.parse(message.toString());
        switch (type) {
          case PlayersCommands.REG: {
            addUser(data, ws);
            break;
          }
          case PlayersCommands.CREATE_ROOM: {
            createRoom(data, ws);
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
