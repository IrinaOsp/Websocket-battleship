interface IUser {
  name: string;
  password: string;
}

export const Users: IUser[] = [];

export const addUser = (userData: unknown) => {
  if (typeof userData !== "string") {
    return null;
  } else {
    const data = JSON.parse(userData);
    Users.push(data);
    console.log("User added ", Users);
  }
};
