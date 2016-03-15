import {Component, EventEmitter} from 'angular2/core';
import {Router} from 'angular2/router';
import {User} from '../../common/model/user/user';
import {AuthService} from '../../auth/auth-service';
import {ContentNode} from './../../common/model/node/content-node';
import {MainMenu} from '../../menu/menu-component';
import {OnInit} from 'angular2/core';
import {ContentDetail} from './../detail/content-detail';
import {ContentService} from './../../common/service/content-service';
import {IsoDatePipe} from '../../common/iso-date-pipe';
import {TagSelect} from '../../common/directives/tag-select/tag-select';
import {UserService} from '../../common/service/user-service';
import {TagService} from './../../common/service/tag-service';
import {SearchNode} from './../../common/model/node/search-node';

let _ = require('lodash');

@Component({
    selector: 'node-list',
    directives: [ContentDetail, MainMenu, TagSelect],
    pipes: [IsoDatePipe],
    template: require('./content-list.html'),
    styles: [require('./content-list.css'), require('../../app.css')],
    providers: [ContentService, UserService, TagService]
})

export class ContentList implements OnInit {

    constructor(private _contentService: ContentService,
                private _router: Router,
                private _userService: UserService,
                private _tagService: TagService,
                private _authService: AuthService) {

        this.nodeEmitter = new EventEmitter();
        this.searchNode =  new SearchNode();
    }

    nodes = [];
    searchNode: SearchNode;
    nodeEmitter: EventEmitter<ContentNode>;
    //Search form select values
    statuses = ['active', 'deleted'];
    types = [];
    users = [];
    currentUser: User;

    getUserNodes() {
        var that = this;
		console.log(`in getUserNodes for ${this._authService.currentUser._id}`);
        this._contentService.getUserNodes(this._authService.currentUser._id)
            .subscribe(
                data => {
                    that.nodes = data;
                    that.currentUser = this._authService.currentUser;
                }
            );
    }

    getUserList() {
        var that = this;
        this._userService.getUsers()
            .subscribe(
                data => {
                    that.users = data;
                }
            );
    }

    //TODO isolate this handler for reuse
    onTypeChanged($event) {
        var type = _.find(this.types, function (t) {
            return t._id === $event;
        });
        this.searchNode.tags = [];
        this.searchNode.type = type;
        this.nodeEmitter.emit(this.searchNode);
    }

    getNodeTypes() {
        var that = this;
        this._tagService.getTypes()
            .subscribe(
                data => {
                    that.types = data;
                }
            );
    }

    deleteNode($event, nodeId) {
        $event.preventDefault();
        this._contentService.deleteNode(nodeId)
            .subscribe(
                this.getUserNodes()
            );
    }

    onSelect(node: ContentNode) {
        this._router.navigate(['ContentDetail', {id: node._id}]);
    }


    newContent() {
        this._router.navigate(['ContentDetail', {id: undefined}]);
    }

	search() {
		console.log("Search clicked");
	}

	reset() {
		console.log("Reset clicked");
	}
	
    ngOnInit() {
        this.getUserNodes();
        this.getUserList();
        this.getNodeTypes();
    }

}