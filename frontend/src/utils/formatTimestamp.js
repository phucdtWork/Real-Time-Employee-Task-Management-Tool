
const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    let date;

    if (typeof timestamp === 'string') {
        if (timestamp.includes(' at ') && timestamp.includes('UTC')) {
            const cleanedTimestamp = timestamp
                .replace(' at ', ' ')
                .replace('UTC+7', '+07:00');

            date = new Date(cleanedTimestamp);
        }
        else if (timestamp.includes('T') || timestamp.includes('Z')) {
            date = new Date(timestamp);
        }
        else {
            date = new Date(timestamp);
        }
    }
    else if (timestamp && timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
    }
    else if (typeof timestamp === 'number') {
        date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
    }


    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1 / 60) {
        return 'Just now';
    }
    else if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minute before`;
    }
    else if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    else if (diffInHours < 48 && diffInHours >= 24) {
        return 'Yesterday';
    }
    else if (diffInHours < 168) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames[date.getDay()];
    }
    else {
        return date.toLocaleDateString('vi-VN');
    }
};

const testFormatTimestamp = () => {
    const testCases = [
        "September 20, 2025 at 10:44:13 AM UTC+7",
        "2025-09-20T10:44:13+07:00",
        new Date(),
        new Date(Date.now() - 1000 * 60 * 30),
        new Date(Date.now() - 1000 * 60 * 60 * 2),
        new Date(Date.now() - 1000 * 60 * 60 * 25),
        { seconds: Math.floor(Date.now() / 1000) },
        1726820653,
        1726820653000,
    ];
};

export { testFormatTimestamp };
export default formatTimestamp;