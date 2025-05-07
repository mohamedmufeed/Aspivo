type PeerData = {
    type: "chat";
    message: string;
  };
  
   export function isPeerData(data: unknown): data is PeerData {
    return typeof data === "object" &&
      data !== null &&
      (data as any).type === "chat" &&
      typeof (data as any).message === "string";
  }
  