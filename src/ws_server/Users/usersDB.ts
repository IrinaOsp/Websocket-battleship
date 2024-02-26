import { IUser, IWinner } from "../../types/types";

export const Users: IUser[] = [];
export const Winners: IWinner[] = [];

export const getUser = (id: string): IUser | undefined => {
  return Users.find((user) => user.id === id);
};
