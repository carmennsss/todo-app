import { Tag } from "primeng/tag";
import { Category } from "./Category";
import { Task } from "./Task";
import { CustomTag } from "./CustomTag";

export interface Client {
    username: string;
    password: string;
    tasks: Task[];
    tags: CustomTag[];
    categories: Category[];
}