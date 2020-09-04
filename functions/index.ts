const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

dotenv.config();

firebase.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  const database = firebase.database();

  const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  );

  const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);


  Promise.all([
    database.ref('/contacts').push({
      name: 'Josh',
      city: 'San Francisco'
    }),
    database.ref('/contacts').push({
      name: 'Tim',
      city: 'Paris'
    })]).then(() => {
      console.log("Contacts added to Firebase");
      process.exit(0);
    }).catch(error => {
      console.error("Error adding contacts to Firebase", error);
      process.exit(1);
    });