import { LangInfo } from "./languageData"
import { StoryData } from "./story"

export type Rate = {
    userId: string, rate: number
}
export interface PageData extends StoryData {
    langInfo: LangInfo[]
}

export type Correction={
    by:string;
    error:string;
    correction:string;
}
export type Page = {
    _id: string
    text: string,
    authorId: string,
    authorName: string,
    ratings: Rate[],
    language: string,
    corrections: Correction[];
}