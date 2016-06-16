import {Injectable} from '@angular/core';
import {HttpClient} from '../../common/http-client';
import {Observable} from 'rxjs/Observable';
import {Notification} from '../directives/notification-center/notification';
import {ApplicationError} from '../../common/error';
import {API_ENDPOINT} from '../../config';
import {NotificationService} from './notification-service';
import {Tag} from '../model/lexicon/tag';
import {Lexicon} from '../model/lexicon/lexicon';

@Injectable()
export class TagService {

    private baseUrl: string;
	private _selectedTags: Array<string> ;

    constructor(private _httpClient: HttpClient,
				private _notificationService: NotificationService) {
				
        this.baseUrl = API_ENDPOINT.concat('/lexicons/');
		this._selectedTags = [];
		console.log(`In tag-service - selected tags set to size ${this._selectedTags.length}`);
		
    }

	getSelectedTags() : Array<string> {
	
		return this._selectedTags; 
		
	}
 
	removeSelectedTag(tag: Tag) : void {

		if(this._selectedTags.indexOf(tag.name) != -1){
			this._selectedTags.splice(this._selectedTags.indexOf(tag.name), 1);
		}
	    console.log(`In removeSelectedTag - ${tag.name} - there are now ${this._selectedTags.length} selected tags`);			

	}

	addSelectedTag(tag: Tag) : void {
	
		this._selectedTags.push(tag.name); 
	    console.log(`In addSelectedTag - ${tag.name} - there are now ${this._selectedTags.length} selected tags`);	
		
	}
	
	getLexicons() {

        console.log(`In getLexicons`);

        return Observable.create(observer => {
            this._httpClient.get(`${this.baseUrl}list?status=active`)
                .map((responseData) => {
                    console.log(`Lexicons : ${JSON.stringify(responseData)}`);
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                    },
                    err => {
                        this._notificationService.handleError(
                            new ApplicationError(
                                'Error loading lexicons',
                                err));
                    },
                    () => {
                        observer.complete();
                    }

                );

            }

        );

    }

    getTags(lexiconId) {

	    console.log(`In getTags - ${lexiconId}`);

        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat(lexiconId).concat('/tags/'))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                    },
                    err => {
                        this._notificationService.handleError(
                            new ApplicationError(
                                'Error loading tags',
                                err));
                    },
                    () => {
                        observer.complete();
                    }

                );

            }

        );

    }

    updateTag(lexiconId: string, tag: Tag) {

        console.log('update : ' + tag.name);

        return Observable.create(observer => {
                this._httpClient.put(this.baseUrl.concat(lexiconId).concat('/tags'), JSON.stringify(tag))
                    .map((responseData) => {
						console.log(`update : ${tag.name} ${responseData.json()}`);					
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error updating tag',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    saveLexicon(lexicon: Lexicon) {

        return Observable.create(observer => {
                this._httpClient.post(this.baseUrl, JSON.stringify(lexicon))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next(data);
                            this._notificationService.publish(new Notification(
                                'Lexicon saved successfully',
                                Notification.types.SUCCESS));

                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error saving lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    updateLexicon(lexicon: Lexicon) {

        return Observable.create(observer => {
                this._httpClient.put(this.baseUrl.concat(lexicon._id), JSON.stringify(lexicon))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                            this._notificationService.publish(new Notification(
                                'Lexicon updated successfully',
                                Notification.types.SUCCESS));
                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error updating lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    deleteLexicon(lexicon: Lexicon) {

        return Observable.create(observer => {
                this._httpClient.delete(this.baseUrl.concat(lexicon._id))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                            this._notificationService.publish(new Notification(
                                'Lexicon deleted successfully',
                                Notification.types.SUCCESS));

                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error deleting lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    addTag(lexiconId: string, tag: Tag) {

        return Observable.create(observer => {
                this._httpClient.post(this.baseUrl.concat(lexiconId).concat('/tags'), JSON.stringify(tag))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error adding tag',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    deleteTag(lexiconId: string, tagId: string) {

        return Observable.create(observer => {
                this._httpClient.delete(this.baseUrl.concat(lexiconId).concat('/tags/').concat(tagId))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error deleting tag',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

}
