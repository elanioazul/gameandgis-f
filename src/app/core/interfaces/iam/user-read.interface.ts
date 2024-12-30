export interface IReadUser {
  id: number,
	name: string;
	surnameOne: string;
	surnametwo: string;
	email: string;
  tokenType: string;
  accessToken: string;
  refreshToken: string
}
