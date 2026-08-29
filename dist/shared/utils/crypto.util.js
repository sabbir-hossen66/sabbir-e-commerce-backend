"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureToken = generateSecureToken;
exports.hashToken = hashToken;
exports.minutesFromNow = minutesFromNow;
const crypto = require("crypto");
function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
function minutesFromNow(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}
//# sourceMappingURL=crypto.util.js.map