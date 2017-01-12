import * as jwt_decode from 'jwt-decode';

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

  login() {
    this.auth0lock.show();
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.isAuthenticated = false;
  }

  tokenIsExpired(token) {
    let jwt = token;
    if (jwt) {
      let jwtExp = jwt_decode(jwt).exp;
      let expiryDate = new Date(0);
      expiryDate.setUTCSeconds(jwtExp);

      if (new Date() < expiryDate) {
        return false;
      }
    }

    return true;
  }

  isTokenValid() {
    let token = localStorage.getItem('id_token');
    if (!token) {
      return false
    }

    let isExpired = this.tokenIsExpired(token);
    if (!isExpired) {
      return true;
    }

    return false;
  }
}