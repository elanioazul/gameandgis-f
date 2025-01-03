export interface IReadUser {
  userDetails: IReadUserDetails,
  tokenType: string;
  accessToken: string;
  refreshToken: string
}

interface IReadUserDetails {
  id: number,
	name: string;
	surnameOne: string;
	surnametwo: string;
	email: string;
}
