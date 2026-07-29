export interface LoginInput {
  email: string;
  password: string;
}

export interface ILoginValidator {
  validate(input: LoginInput): void;
}
