/**
 * Created by Damian.Kelly on 16/06/2016.
 */
import { Component } from '@angular/core';

@Component({
    selector: 'content-publish',
    template: require('./content-publish.html'),
    styles: [require('./content-publish.css')]
})
export class ContentPublish
{
    private publishMsg: string;
    public publishIsVisible: boolean;
    private channels: Array<string> = ['Twitter','Launcher']

    showPublish(msg: string)
    {
        this.publishMsg = msg;
        this.publishIsVisible = true;
    }

    hidePublish()
    {
        this.publishIsVisible = false;
    }

    publish()
    {
        console.log(`publishing ...`);
        this.publishIsVisible = false;
    }

}
