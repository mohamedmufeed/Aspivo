export default interface INotificationService{
    createNotification(userId:string,message:string):void;
    getNotifications(userId:string):void;
    isRead(userId:string,notificationId:string):{updatedNotification:any,message:string}
}