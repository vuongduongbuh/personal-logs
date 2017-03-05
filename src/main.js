import environment from './environment';
import XHR from 'i18next-xhr-backend';

//Configure Bluebird Promises.
Promise.config({
  longStackTraces: environment.debug,
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 5;
      config.settings.enableEscClose = true;
    }).plugin('aurelia-bootstrapper');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  //register the plugin
  aurelia.use.plugin('aurelia-i18n', (instance) => {
    // register backend plugin
    instance.i18next.use(XHR);

    return instance.setup({
      backend: {
        loadPath: '/i18n/{{lng}}.json',
      },
      lng: 'en',
      attributes: ['t', 'i18n'],
      fallbackLng: 'en',
      debug: false
    });
  });

  aurelia.start().then(() => aurelia.setRoot());
}
