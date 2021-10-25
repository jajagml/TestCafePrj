import { Selector } from 'testcafe';
import LoanApplicationBase from './LoanApplicationBase';
import { ApplicantDetails } from '../../testData/models/ApplicantDetails';


export class ApplicantsPage extends LoanApplicationBase{
    private applicantListContainer : Selector = Selector('[id="applicants-list-container"]');
    private applicantListBody : Selector = this.applicantListContainer.find('[id="applicant-list-body"]');
    private applicantsName : Selector = this.applicantListBody.find('tr').nth(0);
    private addApplicantBtn : Selector = Selector('[id="addPersonButton"]');

    public async clickAddApplicant() 
    {
        await this.t
                .click(this.addApplicantBtn);
    }

    public async isApplicantAddedOnTheList(details : ApplicantDetails) 
    {
        let fullName = `${details.firstName} ${details.lastName}`;
        return await this.applicantsName.withText(fullName).visible;
    }

    public async editApplicant(details : ApplicantDetails, forNegativeTest : Boolean = false) 
    {
        let fullName = `${details.firstName} ${details.lastName}`;
        let tableRow =  this.applicantsName.withText(fullName).find('a').withText('edit');
        //let parent = tableRow.parent();
        if(forNegativeTest)
        {
            await this.t
            .setNativeDialogHandler(() => true)
            .click(tableRow, {speed: 0.1});
        } else 
        {
            await this.t
            .click(tableRow, {speed: 0.1});
        }
    }

    public async deleteApplicant(details : ApplicantDetails) 
    {
        let fullName = `${details.firstName} ${details.lastName}`;
        let tableRow =  this.applicantsName.withText(fullName).find('a').withText('delete');

        await this.t
        .setNativeDialogHandler(() => true)
        .click(tableRow, {speed: 0.1});
    }

    public async getDialogMsg()
    {
        const history = await this.t.getNativeDialogHistory();
        return history[0].text;
    }
}