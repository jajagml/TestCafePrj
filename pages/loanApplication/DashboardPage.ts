import { Selector } from 'testcafe';
import LoanApplicationBase from './LoanApplicationBase';
import { ApplicantDetails } from '../../testData/models/ApplicantDetails';
import { MetricsDetails } from '../../testData/models/MetricsDetails';

export class DashboardPage extends LoanApplicationBase{

    //#region New Application Form
    private newApplicationForm : Selector = Selector('[id="form-container"]');
    private amountInput : Selector = this.newApplicationForm.find('[id="loan-amount"]');
    
    private applicantSelect : Selector = this.newApplicationForm.find('[id="applicant-select"]');
    private applicantOptions : Selector = this.applicantSelect.find('option');
    
    private bankSelect : Selector = this.newApplicationForm.find('[id="bank-select"]');
    private bankOptions : Selector = this.bankSelect.find('option');
    
    private termsSelect : Selector = this.newApplicationForm.find("[id='term-select']");
    private termsOptions : Selector = this.termsSelect.find("option");
    
    private applyLoanBtn : Selector = this.newApplicationForm.find('[id="applyLoanButton"]');
    private viewSummaryBtn : Selector = this.newApplicationForm.find('[id="viewSummaryButton"]');
    //#endregion

    //#region Loan Summary
    private installmentTable : Selector = Selector('[id="installmentTable"]');
    private installmentDetails : Selector = this.installmentTable.find('td');
    private loanRejectedMsg : Selector = this.installmentTable.find('div').withText('Loan rejected.');

    private expenseTable : Selector = this.installmentTable.find('[id="expenseTable"]');
    private expenseDetails : Selector = this.expenseTable.find('td');
    //#endregion

    //#region Metrics Container
    private metricsContainer : Selector = Selector('[id="metrics-container"]');

    private totalApproved : Selector = this.metricsContainer.find('[id="total-approved"]');
    private totalRejected : Selector = this.metricsContainer.find('[id="total-rejected"]');
    private totalLoans : Selector = this.metricsContainer.find('[id="total-loans"]');

    private totalBpiLoans : Selector = this.metricsContainer.find('[id="total-bpi-loan"]');
    private totalBdoLoans : Selector = this.metricsContainer.find('[id="total-bdo-loan"]');
    private totalMetroBankLoans : Selector = this.metricsContainer.find('[id="total-metrobank-loan"]');
    //#endregion
    
    public async selectApplicant(details : ApplicantDetails)
    {
        let fullName = `${details.firstName} ${details.lastName}`;
        await this.t
                .click(this.applicantSelect)
                .click(this.applicantOptions.withText(`${fullName}`));

    }

    public async enterLoanAmount(amount : string)
    {
        await this.t
                .typeText(this.amountInput, amount);        
    }

    public async selectBank(bank : string)
    {
        await this.t
                .click(this.bankSelect)
                .click(this.bankOptions.withText(`${bank}`));
    }

    public async clickViewSummary()
    {
        await this.t
                .click(this.viewSummaryBtn);        
    }

    public async isSummaryTableDisplayed()
    {
        return this.installmentDetails.visible;
    }

    public async isLoanRejectedMsgVisible()
    {
        return this.loanRejectedMsg.visible;
    }

    public async getMetricsDetails()
    {
        let metrics : MetricsDetails;

        metrics = {
            totalApproved: await this.totalApproved.innerText,
            totalRejected: await this.totalRejected.innerText,
            totalLoans: await this.totalLoans.innerText,
            totalBPILoans: await this.totalBpiLoans.innerText,
            totalBDOLoans: await this.totalBdoLoans.innerText,
            totalMetrobankLoans: await this.totalMetroBankLoans.innerText,        
        }

        return metrics;
    }

    public async clickApplyLoan()
    {
        await this.t
                .click(this.applyLoanBtn);        
    }

    public async getLoanAmount()
    {
        return await this.installmentDetails.nth(1).innerText;
    }

    public async isBankDetailsAvailable(bank : string, rate : string)
    {
        return await this.installmentDetails.withText(`Name: ${bank}`).visible && await this.installmentDetails.withText(`Interest Rate: ${rate}%`).visible;
    }

    public async isBankTermAvailable(term : string)
    {
        return await this.installmentTable.withText(`${term} Months`).visible;
    }

    public async isMonthlyInstallmentAvailable(monthly : number)
    {
        let money = monthly.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return await this.installmentTable.withText(`${money}`).visible;
    }

    public async verifyBankWithHigherLoans(bank : string)
    {
        let myValue;
        if(bank = 'Metrobank')
        {
            myValue = await this.totalMetroBankLoans.parent('h3').getStyleProperty('font-weight');
        }
        else if(bank = 'BPI')
        {
            myValue = await this.totalBpiLoans.parent('h3').getStyleProperty('font-weight');
        }
        else
        {
            myValue = await this.totalBdoLoans.parent('h3').getStyleProperty('font-weight');
        }

        return myValue;
    }
}