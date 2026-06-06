import fs from 'fs';
import https from 'https';

const configStr = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/products`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const obj = JSON.parse(data);
      if (obj.documents) {
        console.log("FOUND_PRODUCTS_START");
        obj.documents.forEach(doc => {
          const fields = doc.fields;
          const id = doc.name.split('/').pop();
          console.log(JSON.stringify({
            id: id,
            name: fields.name?.stringValue || '',
            brand: fields.brand?.stringValue || '',
            category: fields.category?.stringValue || ''
          }));
        });
        console.log("FOUND_PRODUCTS_END");
      } else {
        console.log("No documents in products collection:", obj);
      }
    } catch (e) {
      console.log("Error parsing json:", e);
    }
    process.exit(0);
  });
}).on('error', (e) => {
  console.error("HTTP GET Error:", e);
  process.exit(1);
});
