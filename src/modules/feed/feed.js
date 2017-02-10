import { inject } from 'aurelia-dependency-injection';
import { BindingEngine } from 'aurelia-binding';


@inject(BindingEngine)
export class Feed {

    constructor(bindingEngine) {
        console.log(bindingEngine);
        this.number = 250;
        this.text = '';
        this.bindingEngine = bindingEngine;
        // subscribe
        let subscription = bindingEngine.propertyObserver(this, 'text')
            .subscribe((newValue, oldValue) => {
                this.number = 250 - newValue.length;
            });
    }

    compose() {
        console.log("compose");
    }

    textChanged(newVal, oldVal) {
        console.log(newVal, oldVal);
    }
}