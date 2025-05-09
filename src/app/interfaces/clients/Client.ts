import { Category } from "../tasks/Category";
import { Task } from "../tasks/Task";
import { CustomTag } from "../tasks/CustomTag";

export interface Client {
    username: string;
    password: string;
    tasks: Task[];
    tags: CustomTag[];
    categories: Category[];
}