/**
 * Created by Damian.Kelly on 24/06/2016.
 */
import {Component, OnInit} from '@angular/core';
import {ComponentInstruction, CanActivate} from '@angular/router-deprecated';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common';

import {Lexicon} from './../../common/model/lexicon/lexicon';
import {Tag} from '../../common/model/lexicon/tag';

import {LexiconService} from './../../common/service/lexicon-service';
import {TagService} from './../../common/service/tag-service';
import {authCheck} from '../../auth/auth-check';
import {MainMenu} from '../../menu/menu-component';
import {UpdateTextfield} from '../../common/directives/update-textfield/update-textfield';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';

let _ = require('lodash');

@Component({
    template: require('./lexicon-detail.html'),
    styles: [require('./lexicon-detail.css'), require('../../app.css')],
    providers: [TagService, LexiconService, PaginationService],
    directives: [UpdateTextfield, MainMenu, CORE_DIRECTIVES, FORM_DIRECTIVES,PaginationControlsCmp],
    pipes: [PaginatePipe]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class LexiconDetail implements OnInit {

    lexicons: Lexicon[];

    lexicon: Lexicon;

    newLexicon: Lexicon;

    tags: Tag[];

    newTag: Tag;

    confirmDelete: boolean;

    constructor(private _tagService: TagService, private _lexiconService: LexiconService) {

    }

    ngOnInit() {
        this.init();

    }

    init() {
        console.log(`In init in lexicon`);
        this._lexiconService.getLexicons()
            .subscribe(
                data => this.lexicons = data
            );
        this.lexicon = new Lexicon();
        this.newLexicon = new Lexicon();
        this.newTag = new Tag();
    }

    onLexiconSelectChanged(lexiconId: string) {
        console.log(`In onLexiconSelectChanged with ${lexiconId}`);
        this.lexicon = _.find(this.lexicons, (t) => {
            return t._id === lexiconId;
        });

        /*        this._tagService.getTags(lexiconId)
         .subscribe(
         tags => this.tags = tags
         );*/

        this.tags = this.lexicon.tags;
        console.log(`In onLexiconSelectChanged with ${lexiconId} : ${JSON.stringify(this.tags)}`);
        this.newLexicon = new Lexicon();
        this.newTag = new Tag();
    }

    createLexicon() {

        if (this.newLexicon.name) {
            this._lexiconService.saveLexicon(this.newLexicon)
                .subscribe(
                    lexicon => {
                        this._lexiconService.getLexicons()
                            .subscribe(
                                data => {
                                    this.lexicons = data;
                                    this.newLexicon = new Lexicon();
                                    this.onLexiconSelectChanged(lexicon._id);
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
        this._lexiconService.deleteLexicon(this.lexicon)
            .subscribe(
                () => {
                    this.cancelDelete();
                    this.init();
                }
            );
    }

    addTag() {
        if (this.newTag.name) {
            this._tagService.addTag(this.newTag)
                .subscribe(res =>
                    this.onLexiconSelectChanged(this.lexicon._id)
                );
        }
    }

    deleteTag(tagId: string) {
        console.log(`In deleteTag in Lexicon - ${tagId}`);
    }

    onLexiconUpdated(lexicon: Lexicon) {
        console.log(`In onLexiconUpdated ${lexicon.name}`);
        this._lexiconService.updateLexicon(this.lexicon)
            .subscribe(res =>
                console.log(`onLexiconUpdated - response from update - ${JSON.stringify(res)}`)
            );
    }

    onTagUpdated(tag: Tag) {
        console.log(`In onTagUpdated ${tag.name}`);
        this._tagService.updateTag(this.lexicon._id, tag)
            .subscribe(res =>
                console.log(`onTagUpdated - response from update - ${JSON.stringify(res)}`)
            );

    }

}
