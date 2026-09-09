export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Label for a date-separator between messages from different calendar days
 * (e.g. a tribe active across midnight). "Today"/"Yesterday" are translated;
 * anything older falls back to a locale-formatted day + month.
 */
export function formatDateSeparator(dateStr: string, t: (key: string) => string, locale: string): string {
    const date = new Date(dateStr);
    const now = new Date();

    if (isSameDay(date, now)) return t('chat.date_separator.today');

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (isSameDay(date, yesterday)) return t('chat.date_separator.yesterday');

    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
}

export function isDifferentDay(a: string, b: string): boolean {
    return !isSameDay(new Date(a), new Date(b));
}