import {BaseEntity} from '../../base-entity';
import {Content} from './content';
import {User} from '../user/user';

export class ContentNode extends BaseEntity {

    name: string;
    user: User;
    tags: string[] = [];
    content: Content[] = [];
    type: string;
    status: string;

    constructor() {
        super();
    }

}
