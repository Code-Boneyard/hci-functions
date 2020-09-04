const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('PROJECT');


exports.addToIndex = functions.firestore.document('projects/{projectId}')

    .onCreate(snapshot => {

        const data = snapshot.data();
        const objectID = snapshot.id;

        return index.addObject({ ...data, objectID });

    });


exports.updateIndex = functions.firestore.document('projects/{projectId}')

    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return index.saveObject({ ...newData, objectID });
    });

exports.deleteFromIndex = functions.firestore.document('projects/{projectId}')

    .onDelete(snapshot => index.deleteObject(snapshot.id));


exports.onProjectCreated = functions.firestore.document('projects/{projectId}').onCreate((snap, context) => {
    // Get the note document
    const project = snap.data();

    // Add an 'objectID' field which Algolia requires
    project.objectID = context.params.projectId;

    // Write to the algolia index
    const index = client.initIndex('projects');
    return index.saveObject(project);
});    