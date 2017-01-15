import { inject } from 'aurelia-framework';
import * as jwt_decode from 'jwt-decode';
import { Router, Redirect } from 'aurelia-router';

@inject(Router)
export class AuthService {
  auth0lock: any;
  auth0lockPasswordless: any;
  auth0Options: any;

  constructor(private router) {
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

    //register callback
    this._registerAuthenticationListener();
  }

  _registerAuthenticationListener() {
    this.auth0lock.on("authenticated", (authResult) => {
      this.auth0lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          return;
        }

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.auth0lock.hide();
        this.router.navigate('feeds');
      });
    });
  }

  login() {
    this.auth0lock.show();
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
  }

  isTokenValid() {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('id_token');
      if (!token) {
        return reject();
      }

      //Check if token is expired
      let jwtExp = jwt_decode(token).exp;
      let expiryDate = new Date(0);
      expiryDate.setUTCSeconds(jwtExp);

      if (new Date() < expiryDate) {
        return reject();
      }

      return resolve();
    });
  }

  // isAuthenticated() {
  //   return this.isTokenValid()
  //     .then(() => {
  //       console.log("Token is valid");
  //     });
  // }

  showLoginIfUnauthorized() {

    this.isTokenValid().then(() => {
      this.router.navigate('feeds');
    }).catch((error) => {
      return this.login();
    });
  }
}