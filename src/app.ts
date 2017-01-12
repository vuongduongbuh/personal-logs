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
    //AuthService.login();
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Personal Log';
    config.map([
      { route: '', redirect: 'feeds'},
      { route: 'feeds', moduleId: 'modules/feed/feed', title: 'New Feeds', settings: { auth: true } },
      { route: 'search', moduleId: 'modules/search/search', title: 'Search', settings: { auth: true } }
    ]);

    var step = new AuthorizeStep(this.authService);
    config.addAuthorizeStep(step)

    this.appTitle = config.title;
  }
}

@inject(AuthService)
class AuthorizeStep {
  authService: any;
  constructor(AuthService) {
    this.authService = AuthService;
  }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      if(!this.authService.isTokenValid()) {
        this.authService.login();
      }
    }

    return next();
  }
}
