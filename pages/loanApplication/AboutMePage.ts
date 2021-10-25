import { Selector } from 'testcafe';
import LoanApplicationBase from './LoanApplicationBase';

export class AboutMePage extends LoanApplicationBase{
    private profileDetailsWrapper : Selector = Selector('[id="profile-details"]');
    private nameProfile : Selector = this.profileDetailsWrapper.find('[id="profile-details"] h3');    
}