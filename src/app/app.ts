import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import {Home} from './home/home';
import {UserList} from './user/list/user-list';
import {UserComponent} from './user/user-component';
import {NotificationCenter} from './common/directives/notification-center/notification-center';
import {NotificationService} from './common/service/notification-service';
import {HttpClient} from './common/http-client';
import {LoginComponent} from './login/login';
import {AuthService} from './auth/auth-service';
import {MainMenu} from './menu/menu-component';
import {NodeComponent} from './node/node';
import {ContentList} from './node/list/content-list';
import {ContentDetail} from './node/detail/content-detail';
import {IsoDatePipe} from './common/iso-date-pipe';
import {LexiconComponent} from './lexicon/lexicon';


/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    providers: [...FORM_PROVIDERS, NotificationService],
    directives: [...ROUTER_DIRECTIVES, NotificationCenter, MainMenu],
    styles: [require('./app.css')],
    template: require('./app.html')
})

@RouteConfig([
    {path: '/', component: Home, name: 'Home', useAsDefault: true},
    {path: '/login', component: LoginComponent, name: 'Login'},
    {path: '/user/...', component: UserComponent, name: 'User'},
    {path: '/lexicon', component: LexiconComponent, name: 'Lexicon'},
    {path: '/content', component: ContentList, name: 'Content'},
    {path: '/content/:id', component: ContentDetail, name: 'ContentDetail'},
    {path: '/**', redirectTo: ['Home']}
])

export class App {
    name = 'Titan';

    constructor() {

    }
}
