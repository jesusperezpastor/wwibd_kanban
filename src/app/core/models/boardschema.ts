import { ListSchema } from './index';
import { UserSchema } from './index';

export interface BoardSchema {
    _id: string;
    name: string;
    description: string;
    dateCreation: Date | string;
    createdBy: string;
    cycleTimeStart: string;
    cycleTimeStartIdList: string;
    cycleTimeEnd: string;
    cycleTimeEndIdList: string;
    users: UserSchema[]
    list: ListSchema[];
}