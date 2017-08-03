export class StringHelper { }

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