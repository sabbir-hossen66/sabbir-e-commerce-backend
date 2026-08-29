"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration = parseDuration;
function parseDuration(duration) {
    const match = duration.match(/^(\d+)(s|m|h|d)$/);
    if (!match)
        return 3600000;
    const val = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 's')
        return val * 1000;
    if (unit === 'm')
        return val * 60000;
    if (unit === 'h')
        return val * 3600000;
    if (unit === 'd')
        return val * 86400000;
    return 3600000;
}
//# sourceMappingURL=time.util.js.map