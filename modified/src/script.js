// Much used constants
const container = document.getElementById('tasklist');

/** Clear the DOM
 * 
 */
const clearDom = () => {
    container.innerHTML = '';
}

/** Add a task to the list and display it on the page
 * 
 */
const addTask = async () => {
    const taskDescriptionElement = document.getElementById('inputTask');
    const taskDescription = taskDescriptionElement.value;
    const taskObject = {description: taskDescription, done: false};
    
    try {
        const response = await postDataToApi(url, taskObject).then(displayMessage('Taak toegevoegd'));
        addToDomList(response);
    } catch (err) {
        console.log('error functie addTask: ', err);
    };

    taskDescriptionElement.value = '';
}

/** Response containing a data object
 * 
 * @param {Object} task Object containing a single task.
 */
const addToDomList = (task) => {
   
    // deconstruct the object
    const {_id: id, description, done} = task;

    // create a tag and set the ID to the taskID
    const newTask = document.createElement('li');
    newTask.classList.add('tasklist__item');
    newTask.setAttribute('id', id);

    // create a textbox and set it correctly
    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type', 'checkbox');
    newCheckbox.classList.add('tasklist__box');
    newCheckbox.addEventListener('change', modifyTaskStatus);
    newCheckbox.checked = done;

    // create the label
    const newLabelForCheckbox = document.createElement('label');
    newLabelForCheckbox.innerText = description;
    newLabelForCheckbox.addEventListener('click', modifyTaskDescription);
    newLabelForCheckbox.classList.add('tasklist__label');
    if (done) newLabelForCheckbox.classList.add('checked')

    // create the trash button
    const newTrash = document.createElement('button');
    newTrash.classList.add('tasklist__button');
    newTrash.innerHTML = '<i class="fas fa-trash-alt"></i>';
    newTrash.addEventListener('click', removeTaskFromList);

    // append the elements to the Li
    newTask.appendChild(newCheckbox);
    newTask.appendChild(newLabelForCheckbox);
    newTask.appendChild(newTrash);

    // append the elements to the ul in the DOM
    container.appendChild(newTask);
}

/** Remove a task from the list and from the api
 * 
 * @param {Object} e listener opject 
 */
const removeTaskFromList = async (e) => {
    const taskElement = e.target.parentElement.parentElement;

    try {
        //check the response from the delete function
        deleteTaskFromApi(url, taskElement.id).then(displayMessage('Taak verwijderd'));
    } catch (err) {
        console.log('removeTaskFromList has a error: ', err);
    }
    // remove the element from the DOM
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
    
    // toggle the checkbox belonging to the task
    labelToModify.classList.toggle('checked');

    //make the object
    const data = {
        description: description,
        done: checkboxClicked.checked
    }

    // send the new data to the api
    putTaskToApi(url, taskID, data).then(displayMessage('Wijziging doorgevoerd.'));
}

/** Modify the task description
 * 
 * @param {Object} e Object listener
 */
const modifyTaskDescription = (e) => {
    const labelClicked = e.target;
    const checkboxBeforClicked = e.target.previousSibling;
    if (checkboxBeforClicked.checked !== true) {
        const parentOfClickedElement = labelClicked.parentElement;
        const currentDescription = labelClicked.innerText;
        
        // to check of the label has been changed by the other handler to prevent double request to api
        document.getElementById('changeLabel').value = 'false';

        // create a input tag with the same text as the label
        const newInput = document.createElement('input');
        newInput.classList.add('tasklist__input');
        newInput.setAttribute('type', 'text');
        newInput.addEventListener('change', changeHandlerModifyTaskDescription);
        newInput.addEventListener('keypress', keypressHandlerModifyTaskDescription);
        newInput.addEventListener('blur', handlerSwitchItBack);
        newInput.addEventListener('focus', function () {this.select()});
        newInput.value = currentDescription;

        // insert the tag
        parentOfClickedElement.insertBefore(newInput, labelClicked.nextSibling);
        
        // put the focus on the tag
        newInput.focus();
        // remove the label
        labelClicked.remove();
    } else {
        displayMessage('Taak reeds afgevinkt.');
    }
}

/** commits the change to the API
 * @param {Object} e HTML element object
 */
const changeHandlerModifyTaskDescription = (e) => { 
    // to check of the label has been changed by the other handler to prevent double request to api
    const changeLabelElement = document.getElementById('changeLabel');
    if (changeLabelElement.value === 'false') {
        commitModifyTaskDescription(e.target).then(changeLabelElement.value = 'true')
    }
}

/** Handler for the keypress event on
 * @param {Object} e listener event
 */
const keypressHandlerModifyTaskDescription = (e) => {
    // to check of the label has been changed by the other handler to prevent double request to api
    const changeLabelElement = document.getElementById('changeLabel');
    if (e.keyCode === 13 && changeLabelElement.value === "false") {
        commitModifyTaskDescription(e.target).then(changeLabelElement.value = "true")
    }
}

/** Save the change of the modified task description to API
 * 
 * @param {Object} sourceElement HTML object
 */
const commitModifyTaskDescription = async (sourceElement) => {
    //save new and current variables
    const newDescription = sourceElement.value;
    const checkStatus = sourceElement.previousSibling.checked;
    const taskID = sourceElement.parentElement.id;

    //New data to send to API
    const changedData = {
        description: newDescription,
        done: checkStatus
    }

    try {
        await putTaskToApi(url, taskID, changedData).then(response => displayMessage('Beschrijving aangepast'));
    } catch (err) {
        console.log('commitModifyTaskDescripton Error: ', err)
    }
    
    // once done with the change, get th focus of the element
    sourceElement.blur();
}

/** Switch back the input and the label
 */
const handlerSwitchItBack = (e) => {  
    switchItBack(e.target);
}

const switchItBack = (sourceElement) => {
    const parentOfChangedElement = sourceElement.parentElement;

    const newLabel = document.createElement('label');
    newLabel.addEventListener('click', modifyTaskDescription);
    newLabel.classList.add('tasklist__label');
    newLabel.innerText = sourceElement.value;
        
    parentOfChangedElement.insertBefore(newLabel, sourceElement.nextSibling);

    sourceElement.remove();
}

/** Check if the right key is pressed
 * Spoileralert... its the Return ;-)
 */
const handleKeyPress = (e) => {
    if (e.keyCode === 13){
        addTask();
    };
}

/** Sort the list by
 * @param {Array} tasks array of objects
 * @param {String} whatToSortBy wat we want to sort bij
 */
const sortTodoTasks = (tasks, asc='') => {
    let sortedTasks = tasks.sort((a, b) => {
        
        comp_1 = a.description.toLowerCase();
        comp_2 = b.description.toLowerCase();

        if (asc === '') {
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

const sortClickHandler = (e) => {
    let switchMain = e.target.parentElement.dataset.sortby;
    let switchSub = e.target.dataset.asc;
    
    displaySorted(switchMain, switchSub);
}

/** Display the list sorted bij filters
 * 
 * @param {String} switchMain 
 * @param {String} switchSub 
 */
const displaySorted = (switchMain, switchSub) => {
        
    const sortBy = document.getElementById('sortBy');
    const sortOrder = document.getElementById('sortOrder');
    
    let sortByValue = sortBy.value;
    let sortOrderValue = sortOrder.value;

    if (switchMain == undefined) switchMain = sortByValue;
    if (switchSub == undefined) switchSub = sortOrderValue;

    let asc = '';
    let messageOrder = '';
    if (switchSub === 'descending') {
        asc = '-';
        sortOrderValue = 'descending';
        messageOrder = 'aflopende';
    } else {
        sortOrderValue = 'ascending';
        messageOrder = 'oplopende';
    }

    let returnUrl = '';
    let messageSort = '';
    switch (switchMain) {
        case 'datecreate':
            returnUrl = url + `?sort=${asc}_createdOn`;
            messageBy = 'invoer datum';
            sortBy.value = 'datecreate';
            break;
        case 'dateupdate':
            returnUrl = url + `?sort=${asc}_updatedOn`;
            messageBy = 'update datum';
            sortBy.value = 'dateupdate';
            break;
        case 'alphabet':
            // Use of own sort. API doesn't take capital letters in account when sorting
            clearDom();
            getDataFromApi(url).then(tasks => {
                const sortedTasks = sortTodoTasks(tasks, asc);
                sortedTasks.forEach(task => {
                    addToDomList(task);
                })
            });
            messageBy = 'alfabet';
            sortBy.value = 'alphabet';
            break;
        case 'checked':
            returnUrl = url + `?sort=${asc}done`;
            messageBy = 'afgevinkt';
            sortBy.value = 'checked';
            break;
        default:
            returnUrl = url;
    }
    clearDom()
    getDataFromApi(returnUrl).then(tasks => {   
        if (switchMain === 'alphabet') tasks = sortTodoTasks(tasks, asc);
        tasks.forEach(data => {
            addToDomList(data);
        });
    });

    displayMessage(`Gesorteerd op ${messageBy} in ${messageOrder} volgorde.`);
}

/** Display message in messagebox
 * 
 * @param {String} message Message to be displayed 
 */
const displayMessage = (message) => {
    const currentTime = new Date();
    let formatTime = currentTime.toLocaleTimeString();

    const messageElement = document.getElementById('messages').firstElementChild;
    messageElement.innerText = `@${formatTime}: ${message}`;
}

// ToDo after load
document.addEventListener('DOMContentLoaded', (e) => {
    displaySorted();
    // document.getElementById('inputTask').addEventListener('change', addTask);
    document.getElementById('inputTask').addEventListener('keypress', handleKeyPress);
    document.getElementById('addTask').addEventListener('click', addTask);
    document.getElementById('navlist').addEventListener('click', sortClickHandler);
    displayMessage('Welkom !')
});

