import { LoginPage, ApplicantsPage, ApplicantDetailsPage, DashboardPage } from '../pages';
import { ApplicantsData } from '../testData/ApplicantData';
import { LoginData } from '../testData/LoginData';
import { Helper } from './TestHelpers';

fixture `TestCafe Final Project`
    .page `http://localhost:9876/`
    .beforeEach(async t => {
        t.ctx.LoginPage = new LoginPage(t);
        t.ctx.ApplicantsPage = new ApplicantsPage(t);
        t.ctx.ApplicantDetailsPage = new ApplicantDetailsPage(t);
        t.ctx.DashboardPage = new DashboardPage(t);
        t.ctx.LoginData = new LoginData();
        t.ctx.ApplicantsData = new ApplicantsData();
        t.ctx.defaultAdmin = t.ctx.LoginData.defaultAdmin();
        t.ctx.Helper = new Helper();

        // Pre-step
        await t.ctx.LoginPage.login(t.ctx.defaultAdmin);

    })
    test
    .meta({ testcaseId: '00001' })
    ("[0001] VALID loan (Loan amount DOESN’T EXCEEDS allowable loan amount, salary greater than all Bank’s requirement)",
    async t => {
        const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails1();

        // Create Applicant, specify required fields
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
            // a. Setup salary and expenses for a valid loan
                // i. Salary greater than all Bank’s requirement
                // ii. Total expenses should suffice allowable loan amount
            await applicantDetailsPage.addApplicantDetails(applicantsDetails);    

        // Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');

        // View Summary Loan
            // a. Navigate to Dashboard page
            await applicantsPage.clickDashboard();
            // b. Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // c. Specify loan amount DOES NOT exceeds allowable loan amount
            await dashboardPage.enterLoanAmount('10000');
            // d. Bank: Any
            await dashboardPage.selectBank('BPI');
            // add pre steps for letter 'g'
            let preMetricsDetails = await dashboardPage.getMetricsDetails();
            // e. Click View Summary
            await dashboardPage.clickViewSummary();           
            // f. Verify View Summary table is displayed
            await t.expect(await dashboardPage.isSummaryTableDisplayed())
            .ok('Verify applicant is successfully added on the list');    
            // g. Verify Metrics should NOT be updated (Negative testing)
            let postMetricsDetails = await dashboardPage.getMetricsDetails();
            await t.expect(preMetricsDetails.totalApproved)
            .eql(postMetricsDetails.totalApproved,'Verify Metrics should NOT be updated - TotalApproved');
            await t.expect(preMetricsDetails.totalRejected)
            .eql(postMetricsDetails.totalRejected,'Verify Metrics should NOT be updated - totalRejected');
            await t.expect(preMetricsDetails.totalLoans)
            .eql(postMetricsDetails.totalLoans,'Verify Metrics should NOT be updated - totalLoans');
            await t.expect(preMetricsDetails.totalBPILoans)
            .eql(postMetricsDetails.totalBPILoans,'Verify Metrics should NOT be updated - totalBPILoans');
            await t.expect(preMetricsDetails.totalBDOLoans)
            .eql(postMetricsDetails.totalBDOLoans,'Verify Metrics should NOT be updated - totalBDOLoans');
            await t.expect(preMetricsDetails.totalMetrobankLoans)
            .eql(postMetricsDetails.totalMetrobankLoans,'Verify Metrics should NOT be updated - totalMetrobankLoans');

        // Apply For Loan
            // a. Click Apply Loan
            await dashboardPage.clickApplyLoan();
            // b. Verify Metrics updated
            let postMetricsDetails1 = await dashboardPage.getMetricsDetails();
                // i. Total Approved increments
                await t.expect(postMetricsDetails.totalApproved < postMetricsDetails1.totalApproved)
                .ok('Verify Metrics updated - TotalApproved');                    
                // ii. Total Loans increments
                await t.expect(postMetricsDetails.totalLoans < postMetricsDetails1.totalLoans)
                .ok('Verify Metrics updated - totalLoans');    
                // iii. Total Bank Loans increments
                await t.expect(postMetricsDetails.totalBPILoans < postMetricsDetails1.totalBPILoans)
                .ok('Verify Metrics updated - totalBPILoans');
    })
    test
    .meta({ testcaseId: '00002' })
    ("[0002] INVALID LOAN A (Loan amount EXCEEDS allowable loan amount, salary greater than all Bank’s requirement)",
    async t => {
        const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails1();

        // 1. Create Applicant, specify required fields
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
            // a. Setup salary and expenses for an invalid loan
                // i. Salary greater than all Bank’s requirement
                // ii. Total expenses should suffice allowable loan amount 
                await applicantDetailsPage.addApplicantDetails(applicantsDetails);    

        // 2. Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');  

        // 3. View Summary Loan
            // a. Navigate to Dashboard page
            await applicantsPage.clickDashboard();
            // b. Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // c. Specify loan amount EXCEEDS allowable loan amount
            await dashboardPage.enterLoanAmount('100000');
            // d. Bank: Any
            await dashboardPage.selectBank('BPI');
            // add pre steps for letter 'g'
            let preMetricsDetails = await dashboardPage.getMetricsDetails();            
            // e. Click View Summary
            await dashboardPage.clickViewSummary();           
            // f. Verify Loan Rejected text is displayed on the right side of Dashboard
            await t.expect(await dashboardPage.isLoanRejectedMsgVisible())
            .ok('Verify applicant is successfully added on the list');    
            // g. Verify Metrics should NOT be updated (Negative testing) 
            let postMetricsDetails = await dashboardPage.getMetricsDetails();
            await t.expect(preMetricsDetails.totalApproved)
            .eql(postMetricsDetails.totalApproved,'Verify Metrics should NOT be updated - TotalApproved');
            await t.expect(preMetricsDetails.totalRejected)
            .eql(postMetricsDetails.totalRejected,'Verify Metrics should NOT be updated - totalRejected');
            await t.expect(preMetricsDetails.totalLoans)
            .eql(postMetricsDetails.totalLoans,'Verify Metrics should NOT be updated - totalLoans');
            await t.expect(preMetricsDetails.totalBPILoans)
            .eql(postMetricsDetails.totalBPILoans,'Verify Metrics should NOT be updated - totalBPILoans');
            await t.expect(preMetricsDetails.totalBDOLoans)
            .eql(postMetricsDetails.totalBDOLoans,'Verify Metrics should NOT be updated - totalBDOLoans');
            await t.expect(preMetricsDetails.totalMetrobankLoans)
            .eql(postMetricsDetails.totalMetrobankLoans,'Verify Metrics should NOT be updated - totalMetrobankLoans');

        // 4. Apply For Loan
            // a. Click Apply Loan
            await dashboardPage.clickApplyLoan();                
            // b. Verify Metrics updated
            let postMetricsDetails1 = await dashboardPage.getMetricsDetails();
                // i. Total Rejected increments
                await t.expect(postMetricsDetails.totalRejected < postMetricsDetails1.totalRejected)
                .ok('Verify Metrics updated - TotalApproved');                        
                // ii. Total Loans increments
                await t.expect(postMetricsDetails.totalLoans < postMetricsDetails1.totalLoans)
                .ok('Verify Metrics updated - totalLoans');                        
                // iii. Total Bank Loans increments
                await t.expect(postMetricsDetails.totalBPILoans < postMetricsDetails1.totalBPILoans)
                .ok('Verify Metrics updated - totalBPILoans');        
    })
    test
    .meta({ testcaseId: '00003' })
    ("[0003] INVALID LOAN B (Loan amount DOESN’T EXCEEDS allowable loan amount, salary less than all Bank’s requirement)",
    async t => {
        const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails2();

        // 1. Create Applicant, specify required fields
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
            // a. Setup salary and expenses for an invalid loan
                // i. Salary less than all Bank’s requirement
                // ii. Total expenses should suffice allowable loan amount 
                await applicantDetailsPage.addApplicantDetails(applicantsDetails);    
        
        // 2. Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');

        // 3. View Summary Loan
            // a. Navigate to Dashboard page
            await applicantsPage.clickDashboard();
            // b. Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // c. Specify loan amount DOES NOT EXCEEDS allowable loan amount
            await dashboardPage.enterLoanAmount('10000');            
            // d. Bank: Any
            await dashboardPage.selectBank('BPI');
            // add pre steps for letter 'g'
            let preMetricsDetails = await dashboardPage.getMetricsDetails();                                    
            // e. Click View Summary
            await dashboardPage.clickViewSummary();            
            // f. Verify Loan Rejected text is displayed on the right side of Dashboard
            await t.expect(await dashboardPage.isLoanRejectedMsgVisible())
            .ok('Verify applicant is successfully added on the list');    
            // g. Verify Metrics should NOT be updated (Negative testing) 
            let postMetricsDetails = await dashboardPage.getMetricsDetails();
            await t.expect(preMetricsDetails.totalApproved)
            .eql(postMetricsDetails.totalApproved,'Verify Metrics should NOT be updated - TotalApproved');
            await t.expect(preMetricsDetails.totalRejected)
            .eql(postMetricsDetails.totalRejected,'Verify Metrics should NOT be updated - totalRejected');
            await t.expect(preMetricsDetails.totalLoans)
            .eql(postMetricsDetails.totalLoans,'Verify Metrics should NOT be updated - totalLoans');
            await t.expect(preMetricsDetails.totalBPILoans)
            .eql(postMetricsDetails.totalBPILoans,'Verify Metrics should NOT be updated - totalBPILoans');
            await t.expect(preMetricsDetails.totalBDOLoans)
            .eql(postMetricsDetails.totalBDOLoans,'Verify Metrics should NOT be updated - totalBDOLoans');
            await t.expect(preMetricsDetails.totalMetrobankLoans)
            .eql(postMetricsDetails.totalMetrobankLoans,'Verify Metrics should NOT be updated - totalMetrobankLoans');

        // 4. Apply For Loan
            // a. Click Apply Loan 
            await dashboardPage.clickApplyLoan(); 
            // b. Verify Metrics updated
            let postMetricsDetails1 = await dashboardPage.getMetricsDetails();
                // i. Total Rejected increments
                await t.expect(postMetricsDetails.totalRejected < postMetricsDetails1.totalRejected)
                .ok('Verify Metrics updated - TotalApproved');                        
                // ii. Total Loans increments
                await t.expect(postMetricsDetails.totalLoans < postMetricsDetails1.totalLoans)
                .ok('Verify Metrics updated - totalLoans');                        
                // iii. Total Bank Loans increments
                await t.expect(postMetricsDetails.totalBPILoans < postMetricsDetails1.totalBPILoans)
                .ok('Verify Metrics updated - totalBPILoans');        
            
    })
    test
    .meta({ testcaseId: '00004' })
    ("[0004] Edit or Delete applicant with existing loans",
    async t => {
        const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails1();

        // 1. Create new applicant, valid loan requirements
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
        await applicantDetailsPage.addApplicantDetails(applicantsDetails);    
        
        // 2. Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');

        // 3. Apply for Loan
            // a. Navigate to Dashboard page
            await applicantsPage.clickDashboard();
            // b. Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // c. Specify amount and Select bank for a valid loan
            await dashboardPage.enterLoanAmount('10000');
            await dashboardPage.selectBank('BPI');
            await dashboardPage.clickApplyLoan();

        // 4. Navigate to Applicants page
        await dashboardPage.clickApplicants();
        
        // 5. Edit applicant
        await applicantsPage.editApplicant(applicantsDetails, true);
            // a. Verify javascript alert message displayed “Could not edit applicant due to 
            // existing loan applications”
            await t.expect(await applicantsPage.getDialogMsg()).eql('Could not edit applicant due to existing loan applications.', 
            'Verify javascript alert message displayed');

        // 6. OR
        // 7. Delete applicant 
        await applicantsPage.deleteApplicant(applicantsDetails);        
            // a. Verify javascript alert message displayed “Could not delete applicant due to 
            // existing loan applications”        
            await t.expect(await applicantsPage.getDialogMsg()).eql('Could not delete applicant due to existing loan applications.', 
            'Verify javascript alert message displayed');

    })
    test
    .meta({ testcaseId: '00005' })
    ("[0005] Edit or Delete applicant with non-existing loans",
    async t => {
        const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails1();

        // 1. Create new applicant, any requirements
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
        await applicantDetailsPage.addApplicantDetails(applicantsDetails);    

        // 2. Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');

        // 3. DON’T Apply for Loan
        await applicantsPage.clickDashboard();
        // 4. Navigate to Applicants page
        await dashboardPage.clickApplicants();
        // 5. Edit applicant 
        await applicantsPage.editApplicant(applicantsDetails);
            // a. Verify edit applicant details page displayed
            await t.expect(await applicantDetailsPage.isEditApplicantPageVisible(applicantsDetails))
            .ok('Verify applicant is successfully added on the list');    
            // b. Verify applicant's first name, last name and Save button are displayed
            await t.expect(await applicantDetailsPage.firstNameValue())
            .eql(applicantsDetails.firstName,'Verify applicant\'s first name');
            await t.expect(await applicantDetailsPage.LastNameValue())
            .eql(applicantsDetails.lastName,'Verify applicant\'s last name');
            await t.expect(await applicantDetailsPage.isSaveButtonVisible())
            .ok('Verify saved button is displayed');
        // 6. OR
        // 7. Delete applicant 
        await applicantDetailsPage.clickBack();
        await applicantsPage.deleteApplicant(applicantsDetails);        
            // a. Verify javascript alert message displayed “Applicant has been successfully 
            // removed!”
            await t.expect(await applicantsPage.getDialogMsg()).eql('Applicant has been successfully removed!', 
            'Verify javascript alert message displayed');
            // b. Verify applicant is deleted from applicant list        
            await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
            .notOk('Verify applicant is deleted from applicant list');
    
    })
    test
    .meta({ testcaseId: '00006' })
    ("[0006] VALID Loan, Verify Monthly Installment breakdown",
    async t => {
        const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails1();

        // 1. Create new applicant, valid loan requirements
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
        await applicantDetailsPage.addApplicantDetails(applicantsDetails);    

        // 2. Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');
        
        // 3. View Summary Loan
            // a. Navigate to Dashboard page
            await applicantsPage.clickDashboard();
            // b. Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // c. Specify amount and Select bank for a valid loan
            await dashboardPage.enterLoanAmount('10000');
            await dashboardPage.selectBank('BPI');
            // d. Click View Summary
            await dashboardPage.clickViewSummary();           
        // 4. Verify Monthly Installment breakdown are correct
            // a. Loan Amount
            await t.expect('P10,000').eql(await dashboardPage.getLoanAmount(),'Verify Loan Amount');
            // b. Bank Details (Interest Rate)
            await t.expect(await dashboardPage.isBankDetailsAvailable('BPI', '4.4')).ok('Verify Bank Details (Interest Rate)');
            // c. Term
            await t.expect(await dashboardPage.isBankTermAvailable('12')).ok('Verify Term');
            // d. Monthly Installment (use Summary Loan Monthly Installment formula above)
            var summary = 10000 / 12 + 10000 * (4.4/100);
            var loanInstallment = t.ctx.Helper.round(summary, 2);
            await t.expect(await dashboardPage.isMonthlyInstallmentAvailable(`${loanInstallment}`)).ok('Monthly Installment (use Summary Loan Monthly Installment formula above)');

    })
    test
    .meta({ testcaseId: '00007' })
    ("[0007] VALID Loan, Verify Metrics, bank with higher loans is in bold text",
    async t => {
                const applicantsPage = t.ctx.ApplicantsPage;
        const applicantDetailsPage = t.ctx.ApplicantDetailsPage;
        const dashboardPage = t.ctx.DashboardPage;
        const applicantsDetails = t.ctx.ApplicantsData.ApplicantDetails1();

        // 1. Create new applicant, valid loan requirements
        await dashboardPage.clickApplicants();
        await applicantsPage.clickAddApplicant();
        await applicantDetailsPage.addApplicantDetails(applicantsDetails);    

        // 2. Verify applicant is successfully added on the list
        await t.expect(await applicantsPage.isApplicantAddedOnTheList(applicantsDetails))
        .ok('Verify applicant is successfully added on the list');
        
        // 3. Apply for Valid Loan (multiple loans for each bank)
            // a.Navigate to Dashboard page
            await applicantsPage.clickDashboard();
            // 1.b.Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // 1.c. Specify amount and Select bank for a valid loan
            await dashboardPage.enterLoanAmount('10001');
            await dashboardPage.selectBank('BDO');
            // 1.d.Click Apply Loan
            await dashboardPage.clickApplyLoan();
            // e.Repeat above steps (b,c,d) to create multiple loans for each bank
            // 2.b.Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // 2.c. Specify amount and Select bank for a valid loan
            await dashboardPage.enterLoanAmount('10002');
            await dashboardPage.selectBank('BPI');
            // 2.d.Click Apply Loan
            await dashboardPage.clickApplyLoan();
        
            // 3.b.Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // 3.c. Specify amount and Select bank for a valid loan
            await dashboardPage.enterLoanAmount('10003');
            await dashboardPage.selectBank('Metrobank');
            // 3.d.Click Apply Loan
            await dashboardPage.clickApplyLoan(); 

            // 4.b.Select applicant
            await dashboardPage.selectApplicant(applicantsDetails);
            // 4.c. Specify amount and Select bank for a valid loan
            await dashboardPage.enterLoanAmount('10004');
            await dashboardPage.selectBank('Metrobank');
            // 4.d.Click Apply Loan
            await dashboardPage.clickApplyLoan();

        // 4. Verify Metrics, bank with higher loans is in bold text
        await t.expect(await dashboardPage.verifyBankWithHigherLoans('Metrobank')).eql('700', 
        'Verify Metrics, bank with higher loans is in bold text'); // 700 is default bold
    })
    

