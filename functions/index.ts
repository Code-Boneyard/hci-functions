const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.config();

// configure firebase
firebase.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);




// Get all projects from Firebase
const projectsRef = database.ref('/projects');
projectsRef.on('child_added', addOrUpdateIndexRecord);
projectsRef.on('child_changed', addOrUpdateIndexRecord);
projectsRef.on('child_removed', deleteIndexRecord);

function addOrUpdateIndexRecord(project) {
    // Get Firebase object
    const record = project.val();
    // Specify Algolia's objectID using the Firebase object key
    record.objectID = project.key;
    // Add or update object
    index
        .saveObject(record)
        .then(() => {
            console.log('Firebase object indexed in Algolia', record.objectID);
        })
        .catch(error => {
            console.error('Error when indexing project into Algolia', error);
            process.exit(1);
        });
}

function deleteIndexRecord({ key }) {
    // Get Algolia's objectID from the Firebase object key
    const objectID = key;
    // Remove the object from Algolia
    index
        .deleteObject(objectID)
        .then(() => {
            console.log('Firebase object deleted from Algolia', objectID);
        })
        .catch(error => {
            console.error('Error when deleting project from Algolia', error);
            process.exit(1);
        });
}

