import { inject } from 'aurelia-framework';
import { Router, Redirect } from 'aurelia-router';
import { AppConstants } from './app-constant';
import { AuthService } from './services/authService/auth-service';

@inject(AuthService)
export class App {
  constructor(AuthService) {
    this.authService = AuthService;
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Personal Log';
    config.addAuthorizeStep(new AuthorizeStep(this.authService))
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

class AuthorizeStep {

  constructor(authService) {
    this.authService = authService;
  }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      if (!this.authService.isTokenValid()) {
        this.authService.login();
      }
    }

    return next();
  }
}
