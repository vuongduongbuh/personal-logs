
export class App {
  router: any;
  appTitle:string;
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      { route: '',              moduleId: 'modules/feed/feed',   title: 'New Feeds'},
      { route: 'feeds',              moduleId: 'modules/feed/feed',   title: 'New Feeds'},
      { route: 'search',              moduleId: 'modules/search/search',   title: 'Search'}
    ]);

    this.appTitle = config.title;
  }
}
