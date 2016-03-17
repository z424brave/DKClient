import {Component, OnInit, EventEmitter} from 'angular2/core';
import {Lexicon} from './../common/model/lexicon/lexicon';
import {TagService} from './../common/service/tag-service';
import {authCheck} from '../auth/auth-check';
import {ComponentInstruction} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {Tag} from '../common/model/lexicon/tag';
import {MainMenu} from '../menu/menu-component';
import {FORM_DIRECTIVES} from 'angular2/common';
import {CORE_DIRECTIVES} from 'angular2/common';
import {UpdateTextfield} from '../common/directives/update-textfield/update-textfield';

let _ = require('lodash');

@Component({
    template: require('./lexicon.html'),
    styles: [require('./lexicon.css'), require('../app.css')],
    providers: [TagService, CORE_DIRECTIVES, FORM_DIRECTIVES,],
    directives: [UpdateTextfield, MainMenu]

})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})
export class LexiconComponent implements OnInit {

    lexicons: Lexicon[];

    lexicon: Lexicon;

    newLexicon: Lexicon;

    tags: Tag[];

    newTag: Tag;

    confirmDelete: boolean;

    constructor(private _tagService: TagService) {

    }

    ngOnInit() {
        this.init();

    }

    init() {
	    console.log(`In init in lexicon`);	
        this._tagService.getTypes()
            .subscribe(
                types => this.lexicons = types
            );
        this.lexicon = new Lexicon();
        this.newLexicon = new Lexicon();
        this.newTag = new Tag();
    }

    onTypeSelectChanged(lexiconId) {
	    console.log(`In onTypeSelectChanged with ${lexiconId}`);	
        this.lexicon = _.find(this.lexicons, function (t) {
            return t._id === lexiconId;
        });

        this._tagService.getTags(lexiconId)
            .subscribe(
                tags => this.tags = tags
            );

        this.newLexicon = new Lexicon();
        this.newTag = new Tag();
    }


    createLexicon() {
        var that = this;
        if (this.newLexicon.name) {
            this._tagService.saveLexicon(this.newLexicon)
                .subscribe(
                    lexicon => {
                        this._tagService.getTypes()
                            .subscribe(
                                types => {
                                    that.lexicons = types;
                                    that.newLexicon = new Lexicon();
                                    that.onTypeSelectChanged(lexicon._id);
                                }
                            );
                    }
                );
        }

    }

    deleteLexicon() {
        this.confirmDelete = true;
    }

    cancelDelete() {
        this.confirmDelete = false;
    }

    doDeleteLexicon() {
        var that = this;
        this._tagService.deleteLexicon(this.lexicon)
            .subscribe(
                response => {
                    that.cancelDelete();
                    that.init();
                }
            );
    }


    addTag() {
        if (this.newTag.name) {
            this._tagService.addTag(this.lexicon._id, this.newTag)
                .subscribe(res =>
                    this.onTypeSelectChanged(this.lexicon._id)
                );
        }
    }

    deleteTag(tagId) {
        this._tagService.deleteTag(this.lexicon._id, tagId)
            .subscribe(res =>
                this.onTypeSelectChanged(this.lexicon._id)
            );
    }


    onTypeUpdated(type: Lexicon) {
        this._tagService.updateLexicon(this.lexicon);
    }

    onTagUpdated(tag: Tag) {
        this._tagService.updateTag(this.lexicon._id, tag);

    }


}