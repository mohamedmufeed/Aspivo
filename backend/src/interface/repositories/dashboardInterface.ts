export interface IDashboardRepositories{
    getUserCountByDateRange(startDate:Date, endDate:Date):Promise<number>
    getJobCountByDateRange(startDate:Date, endDate:Date):Promise<number>
    getCompanyCountByDateRange(startDate:Date, endDate:Date):Promise<number>
    getTotalUserCount():Promise<number>
    getTotalJobCount():Promise<number>
    getTotalCompanyCount():Promise<number>

}