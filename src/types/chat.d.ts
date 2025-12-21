export interface Message {
    username: string;
    message?: string;
    image?: ArrayBuffer;
    timestamp: string;
    system?: boolean;
    description?: string;
    userProfileImage?: string;
}
