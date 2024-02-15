import { WebSocketServer } from "ws";
import { addUser } from "./Users/usersDB";
import { PlayersCommands } from "../types/types";

const WS_PORT = 3000;
export const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on("listening", () => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
});

wsServer
  .on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
      const { type, userData } = JSON.parse(message.toString());
      switch (type) {
        case PlayersCommands.REG: {
          addUser(userData);
          break;
        }
        default: {
          console.log("Unknown command");
        }
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
