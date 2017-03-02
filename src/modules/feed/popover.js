import { inject, customAttribute, bindable, DOM } from "aurelia-framework";
import * as tooltip from "bootstrap";
import * as popover from "bootstrap";

@customAttribute("pl-popover")
@inject(DOM.Element)
export class Popover {

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultValue: true })
  animation;

  @bindable({ defaultValue: false })
  container;

  @bindable({ defaultValue: 0 })
  delay;

  @bindable({ defaultValue: false })
  html;

  @bindable({ defaultValue: "right" })
  placement;

  @bindable({ defaultValue: false })
  selector;

  @bindable({ defaultValue: `<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>` })
  template;

  @bindable({ defaultValue: false })
  templateSelector;

  @bindable({ defaultValue: "" })
  title;

  @bindable({ defaultValue: "click" })
  trigger;

  @bindable({ defaultValue: { selector: "body", padding: 0 } })
  viewport;

  attached() {
    let template;

    if (this.templateSelector) {
      const templateElement = document.querySelector(this.templateSelector);
      template = templateElement.innerHTML;
    } else {
      template = this.template;
    }

    console.log(template);

    $(this.element).popover({
      animation: this.animation,
      container: this.container,
      delay: this.delay,
      html: this.html,
      placement: this.placement,
      selector: this.selector,
      template: template,
      title: this.title,
      trigger: this.trigger,
      viewport: this.viewport
    });
  }
}