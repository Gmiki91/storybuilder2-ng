export type User={
    _id:string,
    name:string,
    email:string,
    active:boolean,
    dailyCompleted:boolean,
    numberOfTablets:number,
    lastActivity:Date,
    markedStoryAt:Date
    markedStoryId:string,
}