import { Category } from "./Category"
import { CustomTag } from "./CustomTag"
import { SubTask } from "./SubTask"

export interface Task {
    id: number,
    title: string,
    desc: string,
    status: string,
    list: Category,
    taglist: CustomTag[],
    date: string
    subtasks: SubTask[]
}