// Updated fetch logic for rss2json.com API

const fetchRSSData = async (rssUrl) => {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=YOUR_API_KEY`);
        const data = await response.json();

        if (data.status === 'ok') {
            return data.items; // Parse and return items instead of XML
        } else {
            console.error('Error fetching RSS:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

// ... (rest of your existing code continues)