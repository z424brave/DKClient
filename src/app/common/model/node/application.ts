/**
 * Created by Damian.Kelly on 01/07/2016.
 */
import {BaseEntity} from '../../base-entity';
import {User} from '../user/user';
import {ContentNode} from "./content-node";
import {ApplicationType} from "./application-type";

export class Application extends BaseEntity {

    name: string;
    user: User;
    tags: string[] = [];
    type: ApplicationType;
    status: string;
    publishable: boolean;
    nodes: ContentNode[];

    constructor() {
        super();
    }

}