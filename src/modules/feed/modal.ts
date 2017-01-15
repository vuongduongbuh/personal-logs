import { DialogController } from 'aurelia-dialog';

export class Modal {
  static inject = [DialogController];
  controller: any;
  constructor(controller) {
    this.controller = controller;
  }
}