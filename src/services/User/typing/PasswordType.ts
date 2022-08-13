export class CheckPasswordRequestType {
  password: string;

  id: string;
}

export class ResetPasswordRequestType {
  password: string;

  token: string;
}
