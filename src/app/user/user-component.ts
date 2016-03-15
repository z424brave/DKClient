import {RouterOutlet} from 'angular2/router';
import {UserService} from './../common/service/user-service';
import {Component} from 'angular2/core';
import {UserList} from './list/user-list';
import {UserDetail} from './detail/user-detail';
import {RouteConfig, CanActivate} from 'angular2/router';
import {tokenNotExpired} from 'angular2-jwt';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MainMenu} from '../menu/menu-component';
import {RouterLink} from 'angular2/router';
import {authCheck} from '../auth/auth-check';
import {ComponentInstruction} from 'angular2/router';
import {Router} from 'angular2/router';


@Component({
    template: require('./user.html'),
    directives: [RouterOutlet, ROUTER_DIRECTIVES, MainMenu],
    providers: [UserService]
})

@RouteConfig([
    {path: '/', name: 'UserList', component: UserList, useAsDefault: true},
    {path: '/:id', name: 'UserDetail', component: UserDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})
export class UserComponent {

    constructor(private _router: Router){

    }



}

