import { ApplicantDetails } from './models/ApplicantDetails';
import { ExpensesDetails, Credit } from './models/ExpensesDetails';

export class ApplicantsData {

    ApplicantDetails1() : ApplicantDetails
    {
        let value = Math.floor((Math.random() * 2000) + 1);
        let user: ApplicantDetails;
        let myExpenses = Array<ExpensesDetails>();
        let myExpense : ExpensesDetails;

        myExpense = {
            amount: 1000,
            description: 'Smart Plan',
            credit: Credit.Plan,        
        }; 
        myExpenses.push(myExpense);
        
        user = {
            firstName: `Jaja${value}`,
            lastName: `Gams${value}`,
            salary: 100000,
            expenses: myExpenses
        }
        return user;
    }
    
    ApplicantDetails2() : ApplicantDetails
    {
        let value = Math.floor((Math.random() * 2000) + 1);
        let user: ApplicantDetails;
        let myExpenses = Array<ExpensesDetails>();
        let myExpense : ExpensesDetails;

        myExpense = {
            amount: 1000,
            description: 'Smart Plan',
            credit: Credit.Plan,        
        }; 
        myExpenses.push(myExpense);
        
        user = {
            firstName: `Jaja${value}`,
            lastName: `Gams${value}`,
            salary: 40000, //20k
            expenses: myExpenses
        }
        return user;
    }
}