export interface ChatMessage {
    _id: string;
    senderId: string;
    message: string;
    imageUrl?: string;
    timestamp: string;
    channel?:string
  }
  
  export interface RawSocketMessage {
    _id?: string;
    senderId: string;
    message: string;
    imageUrl?: string;
    timeStamp: string;
    channel: string;
  }
  
  export interface Conversation {
    employeeId: string;
    employeeName: string;
    lastMessage: string;
    timestamp: string;
    employeeProfile: string;
    unread?: boolean;
    channel?: string;
  }
  export interface FormattedConversation {
    employeeProfile: string;
    employeeId: string;
    employeeName: string;
    lastMessage: string;
    timestamp: string  
    unread: boolean;
    channel: string;
  }
  
  export interface RawConversation {
    targetProfile?: string;
    targetId?: string;
    companyId?: string;
    targetName?: string;
    companyName?: string;
    lastMessage?: string;
    timestamp: string | number | Date;
    unread?: boolean;
    channel?: string;
  }
  