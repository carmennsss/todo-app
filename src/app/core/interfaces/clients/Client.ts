import { Category } from "../tasks/Category";
import { CustomTag } from "../tasks/CustomTag";
import { TaskDB } from "../tasks/TaskDB";

export interface Client {
    username: string;
    password: string;
    tasks: TaskDB[];
    tags: CustomTag[];
    categories: Category[];
}