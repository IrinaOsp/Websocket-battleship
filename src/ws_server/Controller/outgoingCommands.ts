import WebSocket from "ws";
import { ServerCommands } from "../../types/types";
import { Winners } from "../Users/usersDB";

export const regConfirmation = (name: string, id: string, ws: WebSocket) => {
  ws.send(
    JSON.stringify({
      type: ServerCommands.REG,
      data: JSON.stringify({ error: false, errorText: "", name, id }),
      id: 0,
    })
  );
};

export const updateWinners = (name: string, ws: WebSocket) => {
  const winnerData = [
    {
      name: name,
      wins: 0,
    },
  ];
  const message = {
    type: ServerCommands.UPDATE_WINNERS,
    data: JSON.stringify(winnerData),
    id: 0,
  };
  Winners.push(winnerData[0]);
  ws.send(JSON.stringify(message));
};
