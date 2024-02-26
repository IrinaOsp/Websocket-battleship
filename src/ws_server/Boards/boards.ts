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
        board[y + i][x] = length.toString();
      }
    } else {
      for (let i = 0; i < length; i++) {
        board[y][x + i] = length.toString();
      }
    }
  });

  Boards.set(playerId, board);
};

export const checkAttack = (
  board: string[][],
  x: number,
  y: number
): TypeAttackStatus => {
  if (board[y][x] === ".") return "miss";
  if (board[y][x].endsWith("x")) return "shot";

  const shipLength = parseInt(board[y][x]);
  board[y][x] += "x";

  if (board[y][x].startsWith("1")) return "killed";

  let isKilled = true;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (
        board[i][j].startsWith(shipLength.toString()) &&
        !board[i][j].endsWith("x")
      ) {
        isKilled = false;
        break;
      }
    }
    if (!isKilled) break;
  }

  if (isKilled) return "killed";

  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];

  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < board[0].length && ny >= 0 && ny < board.length) {
      if (board[ny][nx].startsWith(shipLength.toString())) {
        return "shot";
      }
    }
  }

  return "shot";
};

export const checkIfFinal = (board: string[][]) => {
  return board
    .flat()
    .filter((cell) => cell !== ".")
    .every((cell) => cell.endsWith("x"));
};
