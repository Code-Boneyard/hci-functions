
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const ALGOLIA_INDEX_NAME =  'PROJECT';


exports.onProjectCreated = functions.firestore.document('projects/{id}').onCreate((snap, context) => {
    // Get the note document
    const project = snap.data();
  
    // Add an 'objectID' field which Algolia requires
    project.objectID = context.params.id;
  
    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(project);
  });