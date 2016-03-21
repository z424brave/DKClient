import {Component} from 'angular2/core';
//import {FORM_DIRECTIVES} from 'angular2/common';
//import {Http} from 'angular2/http';
//import {tokenNotExpired} from 'angular2-jwt';
import {ComponentInstruction, CanActivate} from 'angular2/router';
import {authCheck} from '../auth/auth-check';
import {MainMenu} from '../menu/menu-component';

@Component({

    selector: 'home',
    providers: [],
    directives: [MainMenu],
    pipes: [],
    styles: [require('./home.css')],
    template: require('./home.html')

})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('user', next, previous);
})
export class Home {

    constructor() {

    }

}
