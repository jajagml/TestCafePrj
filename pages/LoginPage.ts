import { Selector } from 'testcafe';
import BasePage from './BasePage';
import { LoginDetails } from '../testData/models/LoginDetails';

export class LoginPage extends BasePage{
    
    private loginUserName : Selector = Selector("[id='user-name']");
    private loginPassword : Selector = Selector("[id='password']");
    private loginBtn : Selector = Selector("[id='loginButton']");

    public async login(details : LoginDetails) 
    {
        await this.t
                .typeText(this.loginUserName, details.userName)
                .typeText(this.loginPassword, details.password)
                .setNativeDialogHandler(() => true)
                .click(this.loginBtn, {speed: 0.1})
                .wait(1000);
    }
}