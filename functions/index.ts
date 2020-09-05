const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const PROJECT_INDEX = client.initIndex('PROJECT');
const TASK_INDEX = client.initIndex('TASK');
const FILE_INDEX = client.initIndex('FILE');
const LOCAL_INDEX = client.initIndex('LOCAL');
const UNION_INDEX = client.initIndex('UNION');
const INDICES_INDEX = client.initIndex('INDICES');
const CONTRACTORS_INDEX = client.initIndex('CONTRACTORS');
const ITEM_DATABASE_INDEX = client.initIndex('ITEM_DATABASE');

// PROJECT METHODS
exports.addProjectToIndex = functions.firestore.document('projects/{projectId}')

    .onCreate(snapshot => {

        const data = snapshot.data();
        const objectID = snapshot.id;

        return PROJECT_INDEX.saveObject({ ...data, objectID });

    });


exports.updateProjectIndex = functions.firestore.document('projects/{projectId}')

    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return PROJECT_INDEX.saveObject({ ...newData, objectID });
    });

exports.deleteProjectFromIndex = functions.firestore.document('projects/{projectId}')

    .onDelete(snapshot => PROJECT_INDEX.deleteObject(snapshot.id));


exports.onProjectCreated = functions.firestore.document('projects/{projectId}').onCreate((snap, context) => {
    // Get the note document
    const project = snap.data();

    // Add an 'objectID' field which Algolia requires
    project.objectID = context.params.projectId;

    // Write to the algolia PROJECT_INDEX
    const PROJECT_INDEX = client.initIndex('PROJECT');
    return PROJECT_INDEX.saveObject(project);
});




// TASK METHODS
exports.addTaskToIndex = functions.firestore.document('tasks/{taskId}')

    .onCreate(snapshot => {

        const data = snapshot.data();
        const objectID = snapshot.id;

        return TASK_INDEX.saveObject({ ...data, objectID });

    });


exports.updateTaskIndex = functions.firestore.document('tasks/{taskId}')

    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return TASK_INDEX.saveObject({ ...newData, objectID });
    });

exports.deleteTaskFromIndex = functions.firestore.document('tasks/{taskId}')

    .onDelete(snapshot => TASK_INDEX.deleteObject(snapshot.id));


exports.onTaskCreated = functions.firestore.document('tasks/{taskId}').onCreate((snap, context) => {
    // Get the note document
    const task = snap.data();

    // Add an 'objectID' field which Algolia requires
    task.objectID = context.params.taskId;

    // Write to the algolia TASK_INDEX
    const TASK_INDEX = client.initIndex('TASK');
    return TASK_INDEX.saveObject(task);
});





// LOCAL METHODS
// UNION METHODS
// INDICES METHODS

// CONTRACTORS METHODS
// ITEM_DATABASE METHODS
// PROJECT METHODS