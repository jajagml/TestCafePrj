import { Selector } from 'testcafe';
import BasePage from '../BasePage';

export default class LoanApplicationBase extends BasePage{
    
    private dashboardTab : Selector = Selector("[id='dashboardLink']");
    private applicantsTab : Selector = Selector("[id='applicantsLink']");
    private aboutMeTab : Selector = Selector("[id='aboutLink']");

    private logoutBtn : Selector = Selector("[class='fa fa-sign-out']");

    public async clickDashboard()
    {
        await this.t
                .click(this.dashboardTab)
    }

    public async clickApplicants()
    {
        await this.t
                .click(this.applicantsTab)
                .wait(1000);
    }

    public async clickAboutMe()
    {
        await this.t
                .click(this.aboutMeTab)
    }    

    public async logout() 
    {
        await this.t
                .click(this.logoutBtn);
    }
}