import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { IGame, ServerCommands } from "../../types/types";
import { Winners } from "../Users/usersDB";
import { WSConnections } from "../Connections/ws-connection";
import { roomsList } from "../Room";
import { Games } from "../Games/games";

export const regConfirmation = (name: string, id: string, ws: WebSocket) => {
  ws.send(
    JSON.stringify({
      type: ServerCommands.REG,
      data: JSON.stringify({ error: false, errorText: "", name, id }),
      id: 0,
    })
  );
};

export const updateWinners = () => {
  Object.keys(WSConnections).forEach((key) => {
    const ws = WSConnections[key];
    const message = {
      type: ServerCommands.UPDATE_WINNERS,
      data: JSON.stringify(Winners),
      id: 0,
    };
    ws.send(JSON.stringify(message));
  });
};

export const updateRoom = () => {
  Object.keys(WSConnections).forEach((key) => {
    const ws = WSConnections[key];
    const message = {
      type: ServerCommands.UPDATE_ROOM,
      data: JSON.stringify(
        roomsList.filter((room) => room.roomUsers.length === 1)
      ),
      id: 0,
    };
    ws.send(JSON.stringify(message));
  });
};

export const createGame = (indexRoom: string) => {
  const room = roomsList.find((room) => room.roomId === indexRoom);
  const gameID = uuidv4();
  const game: IGame = {
    idGame: gameID,
    players: [],
    currentPlayer: 0,
  };
  Games.push(game);
  room?.roomUsers.forEach((user) => {
    game.players.push({ id: user.index, board: [] });
    const message = {
      type: ServerCommands.CREATE_GAME,
      data: JSON.stringify({ idGame: gameID, idPlayer: user.index }),
      id: 0,
    };
    WSConnections[user.index].send(JSON.stringify(message));
  });
};

export const startGame = (playerID: string, game: IGame) => {
  const ships = game.players.find((player) => player.id === playerID)?.board;
  const message = {
    type: ServerCommands.START_GAME,
    data: JSON.stringify({
      ships,
      currentPlayerIndex: playerID,
    }),
    id: 0,
  };

  WSConnections[playerID].send(JSON.stringify(message));
};
