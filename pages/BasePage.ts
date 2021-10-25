import { Selector, t } from 'testcafe';

export default class BasePage {
    protected t: TestController;

    public constructor(t: TestController) {
        this.t = t;
    }
}