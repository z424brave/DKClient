import {BaseEntity} from '../../base-entity';
import {Content} from './content';
import {Tag} from './../lexicon/tag';
import {Lexicon} from './../lexicon/lexicon';
import {User} from '../user/user';

export class ContentNode extends BaseEntity {

    name: string;
    user: User;
    tags: Tag[] = [];
    content: Content[] = [];
    type: Lexicon;
    status: string;

    constructor() {
        super();
    }

}