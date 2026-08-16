const fs = require('fs');

let fileContent = fs.readFileSync('data/cases_data.js', 'utf8');

// We will use regex to find each case block and modify it
// But it's easier to just parse the objects if we strip 'const clinicalCases = '
let jsonStr = fileContent.replace('const clinicalCases = ', '').replace(/;?\s*$/, '');

// Wait, the JS file might have unquoted keys or functions. 
// A safer way is to just do text replacement using regex for 'history: "..."' and 'examination: "..."'

function formatBullets(text) {
    if (!text || text.includes('<ul>')) return text;
    // split by <br><br> or period followed by space
    let sentences = text.split(/<br><br>|\.\s+(?=[Α-ΩA-ZΈΉΊΌΎΏΆ])/);
    
    let html = '<ul>';
    for (let s of sentences) {
        s = s.trim();
        if (s.length > 0) {
            if (!s.endsWith('.')) s += '.';
            html += '<li>' + s + '</li>';
        }
    }
    html += '</ul>';
    return html;
}

// Read the file line by line or use a big regex
fileContent = fileContent.replace(/history:\s*"([^"]+)"/g, (match, p1) => {
    return 'history: "' + formatBullets(p1) + '"';
});

fileContent = fileContent.replace(/examination:\s*"([^"]+)"/g, (match, p1) => {
    return 'examination: "' + formatBullets(p1) + '"';
});

// Now let's try to extract vitals automatically from the examination text
fileContent = fileContent.replace(/vitals:\s*\{[^}]*\},\s*examination:\s*"([^"]+)"/g, (match, examText) => {
    let temp = '';
    let bp = '';
    let hr = '';
    
    // Extract BP (e.g., 96/64 mmHg)
    let bpMatch = examText.match(/(\d{2,3}\/\d{2,3})/);
    if (bpMatch) bp = bpMatch[1] + ' mmHg';
    
    // Extract Temp (e.g., 38,5, 38.5, 37,1)
    let tempMatch = examText.match(/3[5-9][.,]\d/);
    if (tempMatch) temp = tempMatch[0].replace(',', '.') + ' °C';
    
    // Extract HR (e.g., 33/min, 108/min, σφυγμός 75)
    let hrMatch = examText.match(/(\d{2,3})\s*\/\s*min|σφυγμός\s*(?:είναι\s*)?(\d{2,3})/i);
    if (hrMatch) hr = (hrMatch[1] || hrMatch[2]) + ' bpm';
    
    let vitalsProps = [];
    if (temp) vitalsProps.push("temp: '" + temp + "'");
    if (bp) vitalsProps.push("bp: '" + bp + "'");
    if (hr) vitalsProps.push("hr: '" + hr + "'");
    
    let vitalsStr = vitalsProps.length > 0 ? "vitals: { " + vitalsProps.join(', ') + " }," : "";
    
    return vitalsStr + (vitalsStr ? '\n    ' : '') + 'examination: "' + examText + '"';
});

fs.writeFileSync('data/cases_data.js', fileContent, 'utf8');
console.log('Migration completed successfully.');
