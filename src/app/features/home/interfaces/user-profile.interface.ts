export interface IReadUserProfile {
  name: string;
	surnameOne: string;
	surnameTwo: string;
	email: string;
  avatar: IReadAvatar
}
export interface IReadAvatar {
  id: number,
  originalname: string,
  filename: string,
  path: string
}
