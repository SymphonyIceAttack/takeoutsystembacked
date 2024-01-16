import { userIdentityEnum } from 'src/users/userIdentity.enum';

export type PayLoadType = {
  userid: string;
  username: string;
  identity: userIdentityEnum;
};
