export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface IRegistrationValidator {
  validate(input: RegisterInput): void;
}
