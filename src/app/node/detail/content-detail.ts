/// <reference path="../../../../typings/browser/definitions/tinymce/tinymce.d.ts" />
//var tinymce: any = require("../../../../node_modules/tinymce/tinymce");
import {Component, OnInit, EventEmitter} from 'angular2/core';
import {ContentEditor} from '../editor/content-editor';
import {Router, RouteParams, CanActivate, ComponentInstruction} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm} from 'angular2/common';
import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {ContentNode} from './../../common/model/node/content-node';
import {Language} from '../../common/model/language';
import {Content} from './../../common/model/node/content';
import {Media} from './../../common/model/node/media';
import {ContentTab} from './../tab/content-tab';
import {TagSelect} from '../../common/directives/tag-select/tag-select';
import {Tag} from '../../common/model/lexicon/tag';
import {Lexicon} from '../../common/model/lexicon/lexicon';
import {MainMenu} from '../../menu/menu-component';
import {authCheck} from '../../auth/auth-check';
import {AuthService} from '../../auth/auth-service';
import {User} from '../../common/model/user/user';
import {ContentService} from '../../common/service/content-service';
import {TagService} from '../../common/service/tag-service';
import {LanguageService} from '../../common/service/language-service';
import 'rxjs/Rx';

let _ = require('lodash');
declare var tinymce: any;

@Component({
    directives: [ContentEditor, TAB_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, TagSelect, MainMenu],
    providers: [ContentService, TagService, LanguageService],
    template: require('./content-detail.html'),
    styles: [require('./content.css'), require('../../app.css')],
    inputs: ['content']
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('user', next, previous);
})
export class ContentDetail implements OnInit {

    types: Lexicon[] = [];
    node: ContentNode;
    content: Content;
    nodeEmitter: EventEmitter<ContentNode>;
    isNewNode: boolean;
    saveAction: string;

    private tabs: any[];
    private submitted: boolean;
    private supportedLanguages = [];

    constructor(private _contentService: ContentService,
                private _tagService: TagService,
                private _languageService: LanguageService,
                private _authService: AuthService,
                private _routeParams: RouteParams,
                private _router: Router) {
        this.tabs = [];
        this.nodeEmitter = new EventEmitter();
    }

    private activeTab: ContentTab;

    ngOnInit() {
        this.node = new ContentNode();
        this.node.type = new Lexicon();
        this.content = new Content();
        this.content.media = [];
        let id = this._routeParams.get('id');

        var that = this;
        this._tagService.getTypes()
            .subscribe(
                types => {
                    that.types = types;
                    that.initNode(id);
                }
            );
    }

    initNode(id: string) {
        if (id) {
            this.loadNode(id, true);
        } else {
            var that = this;
            this.isNewNode = true;
            let user = new User();
            user._id = this._authService.currentUser._id;
            this.node.user = user;
            this.node.tags = [];
            this.content = new Content();
            this.content.media = [];
            this.content.user = this._authService.currentUser._id;
            this.content.versionNo = 1;
            this.supportedLanguages = [];
            this._languageService.getLanguages()
                .subscribe(languages => {
                    that.supportedLanguages = languages;
                    this.createContentTabs();
                });
        }

        this.saveAction = this.isNewNode ? 'Save' : 'Update';

    }

    loadNode(id: string, initTabs: boolean) {

        var that = this;
        this._contentService.getNode(id)
            .subscribe(
                data => {
                    that.node = data;
                    that.processTags(data);
                    that.initContentTabs(initTabs);
                }
            );

    }


    processTags(node) {
        var tagIds: any[] = this.node.tags;
        var tags = [];
        for (var tagId of tagIds) {
            var selectedTag = _.find(node.type.tags, function (t) {
                return t._id === tagId;
            });
            if (selectedTag) {
                tags.push(selectedTag);
            }
        }

        this.node.tags = tags;
        this.nodeEmitter.emit(this.node);
    }


    createContentTabs() {

        var counter = 0;
        for (var language of this.supportedLanguages) {
            var media = new Media();
            media.language = new Language(language.name, language.iso3166);
            media.content = '';
            this.content.media.push(media);
            this.tabs.push(new ContentTab(
                media,
                counter++ === 0,
                true
            ));
        }

    }

    initContentTabs(init) {
        var counter = 1;
        this.content.user = this._authService.currentUser._id;
        this.content.versionNo = this.node.content[this.node.content.length - 1].versionNo + 1;
		this.content.versionMessage = this.node.content[this.node.content.length - 1].versionMessage;
        var medialist = this.node.content[this.node.content.length - 1].media;
        for (var media of medialist) {
            var newMedia = new Media();
            newMedia.content = media.content;
            newMedia.language = media.language;
            this.content.media.push(newMedia);
            if (init) {
                this.tabs.push(new ContentTab(
                    newMedia,
                    counter++ === 1,
                    counter === medialist.length + 1
                ));
            } else {
                var tab = _.find(this.tabs, {title: newMedia.language.iso3166});
                tab.media = newMedia;
            }
        }
    }

    onSubmit(valid) {
        this.submitted = true;
        var that = this;
        if (valid) {
            if (this.isNewNode) {
				console.log(`In onSubmit about to create node`);
				console.log(JSON.stringify(this.node));				
                this._contentService.createNode(this.node)
                    .toPromise()
                    .then(node => {
						console.log(`In onSubmit about to add content to node`);
						console.log(JSON.stringify(this.content));	
                        this.node = node;
                        return that._contentService.addContent(this.node._id, this.content).toPromise()
                    })
                    .then(this._router.navigate(['Content']));
            } else {
                //Check if content has changed. If not, discard new version.
                var contentChanged = this.hasContentChanged(this.node.content[this.node.content.length - 1].media, this.content.media);
                this._contentService.updateNode(this.node)
                    .toPromise()
                    .then((resp) => {
                        if (contentChanged) {
                            return this._contentService.addContent(this.node._id, this.content).toPromise()
                        } else {
                            return new Promise((resolve, reject) => resolve('ok'))
                        }
                    })
                    .then((resp) => {
                        that.loadNode(that.node._id, false);
                    });

            }
        }
    }

    hasContentChanged(oldMedia, newMedia) {
        for (var media of oldMedia) {
            var content = _.find(newMedia, {content: media.content});
            if (!content) {
                return true;
            }
        }
        return false;

    }


    copyVersionContent(content: Content){
	    console.log(`New content should be ${content.versionMessage}`);
        for(var media of content.media){
            var tab = this.getTabForLanguage(media.language);
            tab.content = media.content;
        }

    }

    getTabForLanguage(language: Language){
        return _.find(this.tabs, function(tab: ContentTab){
            return tab.media.language.iso3166 = language.iso3166;
        });

    }

    refreshMedia() {
        for (var media of this.content.media) {
            if (media.language.iso3166 === this.activeTab.media.language.iso3166) {
                this.activeTab.content = media.content;
            }
        }
    }


    onTypeChanged($event) {
        var type = _.find(this.types, function (t) {
            return t._id === $event;
        });

        this.node.type = type;
        this.nodeEmitter.emit(this.node);
    }

    onVersionMessageChanged($event) {
        this.content.versionMessage = $event;

    }

    onEditorContentChanged($event) {
        this.activeTab.media.content = $event;

    }

    selectTab(tab) {
        tab.active = true;
        this.activeTab = tab;
    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['Content']);
    }

    translate($event) {
        $event.preventDefault();

    }

    publish($event) {
        $event.preventDefault();

    }

}



