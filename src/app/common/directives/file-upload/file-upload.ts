import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader, Headers} from 'ng2-file-upload';
import {FileItem} from 'ng2-file-upload/components/file-upload/file-item.class';
// webpack html imports
let template = require('./file-upload.html');

// const URL = '/api/';
const URL = 'http://localhost:3001/nodes/api/';

@Component({
    selector: 'file-upload',
    template: template,
    styles: [require('./file-upload.css')],
    directives: [FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class FileUpload {

    constructor(){

        this.uploader.setOptions({
            authToken: 'Bearer ' + localStorage.getItem('id_token')
        });
        this.uploader.onSuccessItem = this.handleSuccess;
        
    }

    public uploader:FileUploader = new FileUploader({url: URL});
    public fileUploaded:boolean = false;
    public fileUploadedName:string = '';
    public hasBaseDropZoneOver:boolean = false;

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    };

    public handleSuccess(item: FileItem, response: any, status: any, headers: Headers): any {

        console.log(`success for ${item.file.name}`);
        this.fileUploadedName = item.file.name;
        return { item: item, response: response, status: status, headers: headers };
    };

    public removeUpload() {
        this.uploader.clearQueue();
        this.fileUploaded = true;
        console.log(`File is ${this.fileUploadedName}`);
    };

}
