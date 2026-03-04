export const formatChatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const shortYear = String(year).slice(-2);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Format: dd Mon yy, hh:mm
    // If current year, drop the yy
    if (year === now.getFullYear()) {
        return `${day} ${month}, ${hours}:${minutes}`;
    } else {
        return `${day} ${month} ${shortYear}, ${hours}:${minutes}`;
    }
};

export const hasRestrictedContent = (text: string): boolean => {
    // Regex to block phone numbers, emails, and social handles

    // Email regex
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

    // Phone regex (very basic mapping for numbers mimicking phone info like 555-1234, etc)
    const phonePattern = /(\+\d{1,3}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/;

    // Social keywords & handler mentions
    const socialPattern = /(instagram|ig|insta|snapchat|snap|facebook|fb|twitter|twt|x\.com)\b/i;

    return emailPattern.test(text) || phonePattern.test(text) || socialPattern.test(text);
};
