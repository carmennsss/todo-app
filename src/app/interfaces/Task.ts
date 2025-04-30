import { Category } from "./Category";
import { CustomTag } from "./CustomTag";

export interface Task {
    id: number,
    title: string,
    desc: string,
    status: string,
    list: Category,
    taglist: CustomTag[],
    date: string
}