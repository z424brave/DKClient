/// <reference path="../../../../typings/browser/definitions/tinymce/tinymce.d.ts" />
//var tinymce: any = require("../../../../node_modules/tinymce/tinymce");
import {Component, OnInit, Input, Output, EventEmitter, ElementRef, Inject, AfterViewChecked} from 'angular2/core';


declare var tinymce: any;

@Component({
    selector: 'content-editor',
    template: `<textarea class="content-editor" style="height:300px">{{value}}</textarea>`,
    styles: [require('./content-editor.css')]

})

export class ContentEditor implements OnInit, AfterViewChecked {

    @Input() value: any;
    @Input() language: any;
    @Input() isLast: boolean;
    @Output() valueChange = new EventEmitter();

    constructor(private elementRef: ElementRef) {

    }

    ngOnInit() {
        //
        //var textArea = this.elementRef.nativeElement.querySelector('textarea');
        //textArea.innerHTML = this.value;
    };

    ngAfterViewChecked() {
        var that = this;
        if (this.isLast) {
            tinymce.init(
                {
                    selector: '.content-editor',
                    plugins: ['code'],
                    menubar: false,
                    toolbar1: 'bold italic underline strikethrough alignleft ' +
                    'aligncenter alignright alignjustify styleselect   ' +
                    'bullist numlist outdent indent blockquote undo ' +
                    'redo removeformat subscript superscript | code',
                    setup: (editor) => {
                        editor.on('change', (e, l) => {
                            that.valueChange.emit(
                                editor.getContent()
                            );
                        });

                    }
                });

        }

    };


}