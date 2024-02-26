export const validateUserName = (userName: string): string | null => {
  if (userName.length < 5) {
    return "Name must be at least 5 characters long";
  }
  const userNameRegex = /^[a-zA-Z]+$/;
  if (!userNameRegex.test(userName)) {
    return "Name can only contain letters";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 5) {
    return "Password must be at least 5 characters long";
  }
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must contain at least 5 characters, at least one letter, one number and one special character";
  }

  return null;
};
