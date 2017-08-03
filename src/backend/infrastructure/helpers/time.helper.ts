export class TimeHelper {
    static getTimeUTC() {
        const now = new Date();
        const nowUTC = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );
        return nowUTC;
    };

    static getTimeUTCISO() {
        return TimeHelper.getTimeUTC().toISOString();
    };

    static getTimeUTCYear() {
        return TimeHelper.getTimeUTC().getFullYear();
    };
}