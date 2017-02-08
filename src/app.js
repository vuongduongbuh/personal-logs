import { inject } from 'aurelia-framework';
import { Router, Redirect } from 'aurelia-router';
import { AppConstants } from './app-constant';
import { AuthService } from './services/authService/auth-service';

@inject(AuthService)
export class App {
  constructor(AuthService) {
    this.authService = AuthService;
    console.log("AAAA");
    //AuthService.login();
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Personal Log';
    config.map([
      { route: '', moduleId: 'modules/home/home', title: 'Home' },
      { route: 'home', moduleId: 'modules/home/home', title: 'Home' },
      { route: 'feeds', moduleId: 'modules/feed/feed', title: 'Feeds', settings: { auth: true } },
      { route: 'search', moduleId: 'modules/search/search', title: 'Search', settings: { auth: true } }
    ]);

    config.mapUnknownRoutes('not-found');
    this.appTitle = config.title;
  }
}

