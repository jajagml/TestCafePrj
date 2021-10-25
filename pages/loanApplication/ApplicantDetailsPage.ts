import { Selector } from 'testcafe';
import LoanApplicationBase from './LoanApplicationBase';
import { ApplicantDetails } from '../../testData/models/ApplicantDetails';

export class ApplicantDetailsPage extends LoanApplicationBase{
    //#region Applicant Details
    private applicantsWrapper : Selector = Selector('[id="applicants-wrapper"]');
    private applicantAddBtn : Selector = this.applicantsWrapper.find('[class="applicant-submit"]');
    private applicantBackBtn : Selector = this.applicantsWrapper.find('[class="applicant-reset"]');
    private firstNameInput : Selector = this.applicantsWrapper.find('[id="applicant-firstName"]');
    private lastNameInput : Selector = this.applicantsWrapper.find('[id="applicant-lastName"]');
    private salaryInput : Selector = this.applicantsWrapper.find('[id="applicant-salary"]');
    //#endregion

    //#region Expenses
    private expensesWrapper : Selector = Selector('[id="expenses-wrapper"]');
    private expenseGenerator : Selector = this.expensesWrapper.find('[id="expensesGeneralError"]');
    private expenseContainer : Selector = this.expensesWrapper.find('[id="expenses-container"]');

    private firstAmountExpense : Selector = this.expenseContainer.find('[id="expense-amount-1"]');
    private firstDescriptionExpense : Selector = this.expenseContainer.find('[id="expense-description-1"]');
    private firstExpenseTypeSelect : Selector = this.expenseContainer.find('[id="expense-type-1"]');
    private firstExpenseTypeOptions : Selector = this.firstExpenseTypeSelect.find('option');

    private secondAmountExpense : Selector = this.expenseContainer.find('[id="expense-amount-2"]');
    private secondDescriptionExpense : Selector = this.expenseContainer.find('[id="expense-description-2"]');
    private secondExpenseTypeSelect : Selector = this.expenseContainer.find('[id="expense-type-2"]');
    private secondExpenseTypeOptions : Selector = this.secondExpenseTypeSelect.find('option');

    private thirdAmountExpense : Selector = this.expenseContainer.find('[id="expense-amount-2"]');
    private thirdDescriptionExpense : Selector = this.expenseContainer.find('[id="expense-description-2"]');
    private thirdExpenseTypeSelect : Selector = this.expenseContainer.find('[id="expense-type-2"]');
    private thirdExpenseTypeOptions : Selector = this.thirdExpenseTypeSelect.find('option');
    private expenseAddBtn : Selector = this.expensesWrapper.find('[class="applicant-submit"]');
    private expenseBackBtn : Selector = this.expensesWrapper.find('[class="applicant-reset"]');
    //#endregion

    public async addApplicantDetails(details : ApplicantDetails, secondExpense : Boolean = false, thirdExpense : Boolean = false) 
    {
        await this.t
                .typeText(this.firstNameInput, details.firstName)
                .typeText(this.lastNameInput, details.lastName)
                .typeText(this.salaryInput, details.salary.toString())
                .typeText(this.firstAmountExpense, details.expenses[0].amount.toString())
                .typeText(this.firstDescriptionExpense, details.expenses[0].description)
                .click(this.firstExpenseTypeSelect)
                .click(this.firstExpenseTypeOptions.withText(`${details.expenses[0].credit}`));
  
        if(secondExpense)
        {
            await this.t
                    .typeText(this.secondAmountExpense, details.expenses[1].amount.toString())
                    .typeText(this.secondDescriptionExpense, details.expenses[1].description)
                    .click(this.secondExpenseTypeSelect)
                    .click(this.secondExpenseTypeOptions.withText(`${details.expenses[1].credit}`));
        }
        if(thirdExpense)
        {
            await this.t
                    .typeText(this.thirdAmountExpense, details.expenses[2].amount.toString())
                    .typeText(this.thirdDescriptionExpense, details.expenses[2].description)
                    .click(this.thirdExpenseTypeSelect)
                    .click(this.thirdExpenseTypeOptions.withText(`${details.expenses[2].credit}`));
        }

        await this.t
                .setNativeDialogHandler(() => true)
                .click(this.applicantAddBtn, {speed: 0.1});    
    }

    public async isEditApplicantPageVisible(details : ApplicantDetails) 
    {
        return await this.salaryInput.value == details.salary.toString();
    }

    public async firstNameValue() 
    {
        return await this.firstNameInput.value;
    }

    public async LastNameValue() 
    {
        return await this.lastNameInput.value;
    }

    public async isSaveButtonVisible() 
    {
        return await this.applicantAddBtn.visible;
    }

    public async clickBack() 
    {
        await this.t
                .click(this.applicantBackBtn);
    }
}