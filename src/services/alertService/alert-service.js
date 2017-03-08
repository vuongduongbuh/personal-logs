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
            text: message,
            type: 'error',
            confirmButtonText: 'Cool'
        })
    }

    confirmDelete() {
        return swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
    }
}