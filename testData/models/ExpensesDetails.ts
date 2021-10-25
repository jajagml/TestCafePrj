export interface ExpensesDetails {
    amount: number;
    description: string;
    credit: Credit;
}

export enum Credit{
    CreditCard = 'Credit Card',
    Electricity = 'Electricity',
    Water = 'Water',
    Plan = 'Plan'
}