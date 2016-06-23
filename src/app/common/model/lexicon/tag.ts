import {BaseEntity} from '../../base-entity';
export class Tag extends BaseEntity {

    _id: string;
    name: string;
    description: string;

    constructor() {
        super();
    }

}
