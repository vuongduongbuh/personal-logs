import { customAttribute, inject } from 'aurelia-framework';
import * as tooltip from "bootstrap";
import * as popover from "bootstrap";

@customAttribute('pl-popover')
@inject(Element)
export class Popover {
  constructor(element) {
    this.element = element;
    $(this.element).popover({
      container: 'body',
      html: true
    });
}
}