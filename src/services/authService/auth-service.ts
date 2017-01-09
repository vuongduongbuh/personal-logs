export class AuthService {
  isAuthenticated = false;
  auth0lock: any;
  auth0lockPasswordless: any;
  auth0Options: any;

  constructor() {
    this.auth0lock = {};
    this.auth0lockPasswordless = {};
    this.auth0Options = {
      closable: false,
      language: 'de',
      theme: {
        logo: '/assets/img/icon-naw.jpg',
        primaryColor: '#D11E33'
      },
      languageDictionary: {
        emailInputPlaceholder: "max.meier@nowatwork.ch",
        title: "now@work",
        forgotPasswordAction: "Passwort vergessen? Zum ersten Mal hier?"
      },
      auth: {
        responseType: 'token',
        redirect: false,
        params: {
          scope: 'openid picture email name nickname auth'
        }
      }
    };

    this.auth0lock = new Auth0Lock('G4wIF5AYeG9Dtu4Y5yuOuXFrUYUzfLVu', 'personallog.eu.auth0.com');
    this.auth0lock.on("authenticated", (authResult) => {
      this.auth0lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.isAuthenticated = true;
        this.auth0lock.hide();
      });
    });
  }

  init() {
    this.auth0lock.show();
  }
}