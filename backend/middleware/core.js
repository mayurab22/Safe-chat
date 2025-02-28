const fetch = require('node-fetch');
const apiKey = '******';
// const text = 'this guy is ass dum and a very shitty fucker';

async function censorVulgarity(text) {
    const endpoint = `https://api1.webpurify.com/services/rest/?method=webpurify.live.replace&api_key=${apiKey}&text=${encodeURIComponent(text)}&replacesymbol=*`;

    try {
        const response = await fetch(endpoint);
        const data = await response.text();
        const textRegex = /<text>(.*?)<\/text>/s; // The 's' flag enables the dot to match newline characters
        const textRegex1 = /<found>(.*?)<\/found>/s; // The 's' flag enables the dot to match newline characters
        const match = data.match(textRegex);
        const extractedText = match ? match[1] : null;
        const match1 = data.match(textRegex1);
        const valgNumbers = match1 ? match1[1] : null;
        const valgNumber = parseInt(valgNumbers);
        return {extractedText,valgNumber};
    } catch (error) {
        console.error('Error:', error);
        return text; // Return original text if an error occurs
    }
}

async function checkForVulgarity(text) {
    const endpoint = `https://api1.webpurify.com/services/rest/?method=webpurify.live.check&api_key=${apiKey}&text=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.text();
        // If the response contains "<found>1</found>", it means vulgar words were detected
        return data.includes('<found>1</found>');
    } catch (error) {
        console.error('Error:', error);
        return false; // Return false if an error occurs
    }
}

// Example usage:
// censorVulgarity(text, apiKey)
//     .then(censoredText => {
//         console.log('Censored message:', censoredText);
//     });

module.exports = censorVulgarity;