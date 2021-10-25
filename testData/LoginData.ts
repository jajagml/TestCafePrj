import { LoginDetails } from './models/LoginDetails';

export class LoginData {

    defaultAdmin() : LoginDetails
    {
        let user: LoginDetails;
        user = {
            userName : 'admin',
            password : 'password'
        }
        return user;
    }
}