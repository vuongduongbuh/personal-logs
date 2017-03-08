import { inject } from 'aurelia-framework';
import jwt_decode from 'jwt-decode';
import { Router, Redirect } from 'aurelia-router';
import { AppConstants } from '../../app-constant';

@inject(Router)
export class AuthService {
  constructor(Router) {
    this.router = Router;
    this.auth0Options = {
      closable: false,
      language: 'en',
      languageDictionary: {
        emailInputPlaceholder: "Email",
        title: "Personal Logs",
        forgotPasswordAction: "Forgot your password?"
      },
      auth: {
        responseType: 'token',
        redirect: false
      },
      initialScreen: "signUp"
    };

    this.auth0lock = new Auth0Lock(AppConstants.auth0ClientId, AppConstants.auth0Domain);

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
        this.router.navigate("feeds");
        this.auth0lock.hide();
      });
    });
  }

  login() {
    this.auth0lock.show();
  }

  register() {
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
  }

  isTokenValid() {
    let token = localStorage.getItem('id_token');
    if (!token) {
      return false;
    }

    //Check if token is expired
    let jwtExp = jwt_decode(token).exp;
    let expiryDate = new Date();
    expiryDate.setUTCSeconds(jwtExp);

    console.log(new Date());
    console.log(expiryDate);
    if (new Date() > expiryDate) {
      return false;
    }

    return true;
  }
}