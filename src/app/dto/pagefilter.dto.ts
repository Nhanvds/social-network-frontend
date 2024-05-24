
export interface PageFilter<T>{
    pageNumber:number,
    pageSize:number,
    filter?:T,
    common:string,
    sortProperty:string,
    asc:boolean
}