import {Component, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader, Headers} from 'ng2-file-upload';
import {FileItem} from 'ng2-file-upload/components/file-upload/file-item.class';
import {API_ENDPOINT} from '../../../config';

const UPLOADURL: string = API_ENDPOINT.concat('/nodes/api/');

@Component({
    selector: 'file-upload',
    template: require('./file-upload.html'),
    styles: [require('./file-upload.css')],
    directives: [FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class FileUpload extends FileUploader {
    @Output() onUploaded = new EventEmitter<String>();
    constructor(){
        super({url:  UPLOADURL});
        this.setOptions({
            authToken: 'Bearer ' + localStorage.getItem('id_token')
        });
        this.onSuccessItem = this.handleSuccess;
        console.log(`Upload URL is ${UPLOADURL}`);
        
    }
    public uploadURL:string = API_ENDPOINT.concat('/nodes/api/');
//    public uploader:FileUploader = new FileUploader({url: this.uploadURL});
    public uploader:FileUploader = this;
    public fileUploaded:boolean = false;
    public fileUploadedName:string = '';
    public hasBaseDropZoneOver:boolean = false;

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    };

    public handleSuccess(item: FileItem, response: any, status: any, headers: Headers): any {

        console.log(`success for ${item.file.name}`);
        this.fileUploadedName = item.file.name;
        this.onUploaded.emit(item.file.name);
        console.log(`success for ${this.fileUploadedName}`);
        return { item: item, response: response, status: status, headers: headers };
    };

    public removeUpload() {
        let uploadedFile = this.queue[0].file.name;
        console.log(`File uploaded is ${uploadedFile}`);
        console.log(`File uploaded is ${this.fileUploadedName}`);
        this.clearQueue();
        this.fileUploaded = true;
        this.onUploaded.emit(uploadedFile);
    };

}
