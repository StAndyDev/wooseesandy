export function calculateChangePercentage(current, previous) {
    if (previous > 0) {
        return Number(((current - previous) / previous * 100).toFixed(2));
    } else {
        return current === 0 ? 0 : 100.00;
    }
}