import { WebSocketServer } from "ws";

const WS_PORT = 3000;
export const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on("listening", () => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
});

wsServer.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log(message);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
