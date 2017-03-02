import { inject } from 'aurelia-framework';

import * as ES6Promise from "es6-promise";
import { default as swal } from 'sweetalert2';

export class AlertService {
    constructor() {

    }

    success(message) {
        return swal({
            title: 'Success',
            text: message,
            type: 'success',
            confirmButtonText: 'Cool'
        })
    }

    error(message) {
        return swal({
            title: 'Error!',
            text: 'Do you want to continue',
            type: 'error',
            confirmButtonText: 'Cool'
        })
    }
}