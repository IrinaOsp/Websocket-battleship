import { TypeAttackStatus, TypeBoard } from "../../types/types";

export const Boards = new Map<string, string[][]>();

export const createBoard = (ships: TypeBoard, playerId: string) => {
  const boardSize = 10;
  const board: string[][] = [];

  for (let i = 0; i < boardSize; i++) {
    board.push(Array(boardSize).fill("."));
  }

  ships.forEach((ship) => {
    const {
      position: { x, y },
      direction,
      length,
    } = ship;
    if (direction) {
      for (let i = 0; i < length; i++) {
        board[y + i][x] = "x";
      }
    } else {
      for (let i = 0; i < length; i++) {
        board[y][x - i] = "x";
      }
    }
  });
  // console.log(board);

  Boards.set(playerId, board);
};

export const checkAttack = (
  board: string[][],
  x: number,
  y: number
): TypeAttackStatus => {
  if (board[y][x] === "x" || board[y][x] === "o") {
    board[y][x] = "o";
    if (y === 0 && x === 0) {
      if (board[y][x + 1] !== "o" || board[y + 1][x] !== "o") return "shot";
    }
    return "shot";
  }
  return "miss";
};
