import { RolesEnum } from 'src/modules/users/enums/roles.enum';

export interface TokenPayload {
  id: string;
  role: RolesEnum;
}
