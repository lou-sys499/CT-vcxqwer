const fs = require('fs');
const https = require('https');

const configStr = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/products`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
});
