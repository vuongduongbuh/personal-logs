import { inject } from 'aurelia-framework';
import { Router, Redirect } from 'aurelia-router';
import { AppConstants } from './app-constant';
import { AuthService } from './services/authService/auth-service';

@inject(AuthService)
export class App {
  router: any;
  appTitle: string;
  authService: any;
  constructor(AuthService) {
    this.authService = AuthService;
    AuthService.login();
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Personal Log';
    config.map([
      { route: '', moduleId: 'modules/home/home', title: 'Home' },
      { route: 'home', moduleId: 'modules/home/home', title: 'Home' },
      { route: 'feeds', moduleId: 'modules/feed/feed', title: 'Feeds', settings: { auth: true } }
    ]);

    config.mapUnknownRoutes('not-found');
    this.appTitle = config.title;
  }
}

