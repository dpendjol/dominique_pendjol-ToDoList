const url = process.env.API_URL;


/** Gets data from API, returns it in JSON format
 * 
 * @param {String} apiEndpoint Endpoint API
 */
const getDataFromApi = async (apiEndpoint) => {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

/** Post data to the JSONBox
 * 
 * @param {String} apiEndpoint URL of endpoint
 * @param {Object} postData JSON object with data
 */
const postDataToApi = async (apiEndpoint, postData) => {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const deleteTaskFromApi = async (apiEndpoint, idToDelete) => {
    try {
        const response = await fetch(`${apiEndpoint}/${idToDelete}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const putTaskToApi = async (apiEndpoint, idToUpdate, updateData) => {
    try {
        const response = await fetch(`${apiEndpoint}/${idToUpdate}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}