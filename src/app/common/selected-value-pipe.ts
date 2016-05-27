import {Pipe} from '@angular/core';
import {UpdateFromSelectValue} from './model/update-from-select-value';
// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
    name: 'SelectedValuePipe'
})
export class SelectedValuePipe {

    // Transform is the new "return function(value, args)" in Angular 1.x
    transform(value, selected: boolean) {
        // ES6 array destructuring
        console.log(`SelectedValuePipe - selected is ${selected}`);
        return value.filter((availableValue: UpdateFromSelectValue) => {
/*            if (selected) {
                return availableValue.selected;
            } else {
                return !availableValue.selected;
            }*/
            return availableValue.selected === selected;
        });
    }

}
