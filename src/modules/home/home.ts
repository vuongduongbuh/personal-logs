import { inject } from 'aurelia-framework';
import {Router} from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from '../../services/authService/auth-service';

@inject(Router, AuthService)
export class Home {
    appService: any;
    searchValue: string;
    constructor(Router, AuthService) {
        AuthService.showLoginIfUnauthorized();
    }
}
