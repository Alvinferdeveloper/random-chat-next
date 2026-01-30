export interface ReplyContext {
    id: string;
    author: string;
    messageSnippet: string;
}

export interface Reaction {
    emoji: string;
    users: string[]; // Array of usernames
}

export interface BaseMessage {
    id: string;
    username: string;
    userProfileImage: string | null;
    timestamp: string;
    replyTo: ReplyContext | null;
    reactions?: Reaction[];
    system?: boolean;
}

export interface TextMessage extends BaseMessage {
    message: string;
}

export interface ImageMessage extends BaseMessage {
    imageUrl: string;
    description?: string;
    isUploading?: boolean;
}

export type Message = TextMessage | ImageMessage;

// Type guard to check if a message is a TextMessage
export function isTextMessage(message: Message): message is TextMessage {
    return (message as TextMessage).message !== undefined;
}

// Type guard to check if a message is an ImageMessage
export function isImageMessage(message: Message): message is ImageMessage {
    return (message as ImageMessage).imageUrl !== undefined;
}
