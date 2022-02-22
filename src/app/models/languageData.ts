export type Text = 'Beginner'| 'Intermediate'|'Advanced';
export type Code = 'A' | 'B' | 'C' ;
export type Level ={
    text:Text, code:Code
}
export const levels:{text:Text,code:Code}[]=[
    {text:'Beginner', code:'A'},
    { text:'Intermediate', code:'B'},
    { text:'Advanced', code:'C'},
]

export const getLevelText = (code:Code)=>{
   const level= levels
    .find(level=>level.code===code)
    return level?.text;
}
