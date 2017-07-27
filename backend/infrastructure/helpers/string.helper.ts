export class StringHelper {
    static getRandomCode(len?: number, sc?: boolean) {
        const lengthSettings = len != null ? len : 6;
        const result = Math.random().toString(36).substr(2, lengthSettings);
        if (sc != null && sc) {
            return result.toLocaleLowerCase();
        } else {
            return result.toUpperCase();
        }
    };
}

declare global {
    interface String {
        format(replacements: string[]): string;
        capitalize(): string;
    }
}

String.prototype.format = function () {
    const args = arguments[0];
    return this.replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = { StringHelper };