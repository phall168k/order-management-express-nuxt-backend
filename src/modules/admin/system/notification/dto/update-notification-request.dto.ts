export interface UpdateNotificationRequestDto {
    title?: string;
    subject?: string;
    reciever?: string;
    notificationType?: string;
    link?: string;
    isSeen?: boolean;
}
