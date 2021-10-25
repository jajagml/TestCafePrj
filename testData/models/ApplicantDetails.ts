import { ExpensesDetails } from "./ExpensesDetails";

export interface ApplicantDetails {
    firstName: string;
    lastName: string;
    salary: number;
    expenses: Array<ExpensesDetails>;
}