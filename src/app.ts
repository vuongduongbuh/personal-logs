import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AppConstants } from './app-constant';
import { AuthService } from './services/authService/auth-service';

@inject(AuthService)
export class App {
  router: any;
  appTitle: string;

  constructor(AuthService) {
    //AuthService.init();
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      { route: '', moduleId: 'modules/feed/feed', title: 'New Feeds' },
      { route: 'feeds', moduleId: 'modules/feed/feed', title: 'New Feeds' },
      { route: 'search', moduleId: 'modules/search/search', title: 'Search' }
    ]);

    this.appTitle = config.title;
  }
}
