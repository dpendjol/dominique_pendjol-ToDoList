/**
 * Add a task to the list and display it on the page
 */
const addTask = async () => {
    const taskDescriptionElement = document.getElementById('inputTask');
    const taskDescription = taskDescriptionElement.value;
    const taskObject = {description: taskDescription, done: false};
    
    try {
        const response = await postDataToApi(url, taskObject);
        addToDomList(response);
    } catch (err) {
        console.log('error functie addTask: ', err);
    };

    taskDescriptionElement.value = '';
}

/**
 * Response containing a data object
 * @param {Object} response 
 */
const addToDomList = (response) => {
    // make it a async function

    const listParent = document.getElementById('taskList');
    const {_id: id, description, done} = response;

    const newTask = document.createElement('li');
    newTask.classList.add('tasklist__item');
    newTask.setAttribute('id', id);

    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type', 'checkbox');
    newCheckbox.classList.add('tasklist__checkbox');
    newCheckbox.addEventListener('change', modifyTaskStatus);
    newCheckbox.checked = done;

    const newLabelForCheckbox = document.createElement('label');
    newLabelForCheckbox.innerText = description;
    newLabelForCheckbox.classList.add('tasklist__label');
    newLabelForCheckbox.addEventListener('click', modifyTaskDescription);
    if (done) newLabelForCheckbox.classList.add('checked')

    const newTrash = document.createElement('button');
    newTrash.classList.add('tasklist__button');
    newTrash.innerHTML = '<i class="fas fa-trash-alt"></i>';
    newTrash.addEventListener('click', removeTaskFromList);

    newTask.appendChild(newCheckbox);
    newTask.appendChild(newLabelForCheckbox);
    newTask.appendChild(newTrash);

    listParent.appendChild(newTask);
}

/** Remove a task from the list and from the api
 * 
 * @param {Object} e listener opject 
 */
const removeTaskFromList = async (e) => {
    const taskElement = e.target.parentElement.parentElement;

    try {
        //check the response from the delete function
        deleteTaskFromApi(url, taskElement.id);
    } catch (err) {
        console.log('removeTaskFromList has a error: ', err);
    }

    taskElement.remove();
}

/** Modifies the task checkbox. To make shure it stay's in sync.
 * 
 * @param {Object} e Object listener
 */
const modifyTaskStatus = (e) => {
    const checkboxClicked = e.target;
    const taskID = e.target.parentElement.id;
    const labelToModify = checkboxClicked.nextSibling;

    const description = labelToModify.innerText;

    labelToModify.classList.toggle('checked');

    //make the object
    const data = {
        description: description,
        done: checkboxClicked.checked
    }

    putTaskToApi(url, taskID, data);
}

/** Modify the task description
 * 
 * @param {Object} e Object listener
 */
const modifyTaskDescription = (e) => {
    const textClicked = e.target;
    const parentOfClickedElement = textClicked.parentElement;
    const currentDescription = textClicked.innerText;

    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.classList.add('tasklist__input')
    newInput.addEventListener('change', commitModifyTaskDescription);
    newInput.addEventListener('blur', switchItBack);
    newInput.addEventListener('focus', function () {this.select()});
    newInput.value = currentDescription;

    parentOfClickedElement.insertBefore(newInput, textClicked.nextSibling);

    newInput.focus();
    textClicked.remove();
}

/** Switch back the input and the label
 */
const switchItBack = (e) => {  
    const newLabel = document.createElement('label');
    newLabel.innerText = e.target.value;
    newLabel.classList.add('tasklist__label');
    newLabel.addEventListener('click', modifyTaskDescription);

    const parentOfChangedElement = e.target.parentElement;
    parentOfChangedElement.insertBefore(newLabel, e.target.nextSibling);

    e.target.remove();
}

/** commits the change to the API
 * @param {Object} e HTML element object
 */
const commitModifyTaskDescription = async (e) => {
    const changedInputFieldElement = e.target;
    
    //save new and current variables
    const newDescription = changedInputFieldElement.value;
    const checkStatus = changedInputFieldElement.previousSibling.checked;
    const taskID = changedInputFieldElement.parentElement.id;

    //New data to send to API
    const changedData = {
        description: newDescription,
        done: checkStatus
    }

    try {
        await putTaskToApi(url, taskID, changedData);
    } catch (err) {
        console.log('commitModifyTaskDescripton Error: ', err)
    }
    
}

/** Check if the right key is pressed
 * Spoileralert... its the Return ;-)
 */
const handleKeyPress = (e) => {
    if (e.keyCode === 13){
        addTask();
    };
}

const sortTodoTasks = (tasks, whatToSortBy, asc=true) => {
    let sortedTasks = tasks.sort((a, b) => {
        if (whatToSortBy === 'date') {
            comp_1 = a._createdOn;
            comp_2 = b._createdOn;
        }

        if (asc) {
            if (comp_1 < comp_2) { return -1 };
            if (comp_1 > comp_2) { return 1 };
        } else {
            if (comp_1 > comp_2) { return -1 };
            if (comp_1 < comp_2) { return 1 };
        }
        return 0; 
    });

    return sortedTasks;
} 

const loadContentInfo = (whatToSortBy='date', asc=true) => {
    const container = document.getElementById('taskList');
    container.innerHTML = '';

    getDataFromApi(url).then(datas => {
            
        const datArray = sortTodoTasks(datas, whatToSortBy, asc);

        datArray.forEach(data => {
            addToDomList(data)
        });
    });
}

// ToDo after load
document.addEventListener('DOMContentLoaded', (event) => {
    loadContentInfo();
    // document.getElementById('inputTask').addEventListener('change', addTask);
    document.getElementById('inputTask').addEventListener('keypress', handleKeyPress)
    document.getElementById('addTask').addEventListener('click', addTask);
});

