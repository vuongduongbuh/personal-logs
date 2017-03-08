import { inject } from 'aurelia-framework';
import { Router, Redirect } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';
import { AppConstants } from './app-constant';
import { AuthService } from './services/authService/auth-service';

@inject(AuthService, I18N)
export class App {
  constructor(AuthService, i18n) {
    this.authService = AuthService;
    this.i18n = i18n;
    this.i18n.setLocale('en')
      .then(() => {
        console.log('Locale is ready!');
      });
    //AuthService.login();
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
      if(!this.authService.isTokenValid()) {
        this.authService.login();
      }
    }

    return next();
  }
}
