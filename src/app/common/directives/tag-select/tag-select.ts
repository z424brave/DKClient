import {Component, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {OnInit} from 'angular2/core';
import {Tag} from '../../model/lexicon/tag';
import {Input} from 'angular2/core';
import {TagService} from '../../service/tag-service';
import {ContentNode} from '../../model/node/content-node';
let _ = require('lodash');

@Component({
    selector: 'tag-select',
    template: require('./tag-select.html'),
    styles: [require('./tag-select.css')],
    directives: [CORE_DIRECTIVES],
    providers: [TagService]
})


export class TagSelect implements OnInit {

    @Input()nodeEmitter: EventEmitter<ContentNode>;


    constructor(private _tagService: TagService) {

    }

    node: ContentNode;

    selectedTags: Array<Tag> = [];

    tags: Array<Tag> = [];

    selectTag(tag) {

        console.log('selected tag: ' + tag);
        if (_.findIndex(this.selectedTags, function (currentTag) {
                return currentTag._id === tag._id;
            }) === -1) {
            this.selectedTags.push(tag);
        } else {
            this.removeTag(tag);
        }
        this.node.tags = this.selectedTags;

    }

    removeTag(tag) {
        _.remove(this.selectedTags, function (currentTag) {
            return currentTag._id === tag._id;
        });

    }


    onNodeChange(node: ContentNode) {
        this._tagService.getTags(node.type._id).subscribe(
            tags => this.tags = tags
        );
        this.selectedTags = node.tags;
        this.node = node;
    }


    ngOnInit() {
        this.nodeEmitter.subscribe(node =>
            this.onNodeChange(node));

    }


}
