import { inject } from 'aurelia-framework';
import { AuthService } from '../../services/authService/auth-service';

@inject(AuthService)
export class Home {
    constructor(AuthService) {
        this.authService = AuthService;
    }

    login() {
        this.authService.login();
    }

    signUp() {
        this.authService.register();
    }
}