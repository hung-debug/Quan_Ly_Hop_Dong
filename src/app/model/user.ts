import { Role } from './role';

export class User {
    id: number = 0;
    username: string = '';
    password: string = '';
    firstName: string = '';
    lastName: string = '';
    role:any = Role;
    token?: string;
}
