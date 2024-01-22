



const clients_table = document.querySelector(".clients-table");
const tasks_table = document.querySelector(".tasks-table");





const fetch_clients = async () => {
    const api = "http://localhost:5000/clients/getAllClients";

    try {
        // Wait for the fetch to complete and get the response
        let response = await fetch(api);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Wait for the JSON parsing to complete
        let jsonRes = await response.json();
        let clients = jsonRes.data.clients;
        // Handle the data from the API response
        console.log("API Response:", clients);
        // ${client.courses[0].tasks}
        clients.forEach(client => {
            clients_table.innerHTML += `
        
            <tr>
                <td> ${client.name}</td>
                <td> ${client.group} </td>
                <td>   </td>
                <td> <input class="client_checkBox" data-email="${client.email}" type="checkbox"  name="checkbox" value="checked" id=""></td>
                

            </tr>
        `
        });


    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error("Fetch Error:", error);
    }
};



const fetch_tasks=async()=>{

    const api = "http://localhost:5000/tasks/getAllTasks";

    try {
        // Wait for the fetch to complete and get the response
        let response = await fetch(api);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Wait for the JSON parsing to complete
        let jsonRes = await response.json();
        let  tasks= jsonRes.data.tasks;
        // Handle the data from the API response
        console.log("API Response:", tasks);

        tasks.forEach(task => {
            tasks_table.innerHTML += `
        
            <tr>
                <td> ${task.title}</td>
                <td> ${task.description} </td>
                
                <td> <input class="task_checkBox" data-taskId="${task._id}" type="checkbox"  value="checked" id=""> ${task._id}</td>
                

            </tr>
        `
        }
        );


    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error("Fetch Error:", error);
    }

}






const x=()=>{
    const clients_checkBox=document.querySelectorAll(".client_checkBox");
    const tasks_checkBox=document.querySelectorAll(".task_checkBox");
    console.log(clients_checkBox);

    tasks_checkBox.forEach(task_checkBox=> {
        if(task_checkBox.checked){
            let taskId=task_checkBox.dataset.taskid;
            console.log("taskId",taskId);

            clients_checkBox.forEach(client_checkBox => {
                // console.log(box.dataset.email);
                // console.log(client_checkBox);

                if(client_checkBox.checked){
                    let email=client_checkBox.dataset.email;
                    // console.log(email);
                    sendRequest(email,taskId);
                }
            });
        }
    });




}



async function sendRequest(email,taskId) {
    // event.preventDefault(); // Prevents the default form submission



    var formData = {
        "email": email,
        "taskId": taskId
    };

    try {
        const response = await fetch('http://localhost:5000/clients/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        var responseMessage = document.getElementById('response-message');
        responseMessage.textContent = 'Task added to email successfully!';
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        var responseMessage = document.getElementById('response-message');
        responseMessage.textContent = 'Error adding task to email. Please try again.';
    }
}