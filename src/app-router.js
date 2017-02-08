export function AppRouter(config) {
    config.title = 'Personal Log';
    config.options.pushState = true;

    config.map([
        { route: '', moduleId: 'modules/home/home', title: 'Home' },
        { route: 'home', moduleId: 'modules/home/home', title: 'Home' },
        { route: 'feeds', moduleId: 'modules/feed/feed', title: 'Feeds', settings: { auth: true } },
        { route: 'search', moduleId: 'modules/search/search', title: 'Search', settings: { auth: true } }
    ]);
}