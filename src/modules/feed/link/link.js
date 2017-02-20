import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export class AddLinkModal {
  constructor(controller) {
    this.controller = controller;
  }
}