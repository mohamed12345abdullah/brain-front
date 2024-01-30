if (typeof serverURL === 'undefined') {
    var serverURL = false||"https://server-wheat-five.vercel.app";
    // "http://localhost:5000"
}

const getcoursesURL = serverURL + "/courses/getAllCourses";
const reservecourseURL = serverURL + "/clients/reserveCourse/"; // Removed ":id" from the URL
const signupURL = serverURL + "/clients/addclient";
const loginURL = serverURL + "/clients/login";
const getUserURL = serverURL + "/clients/getClient";
const addREQURL = serverURL + "/requests/addReq";

let buyButtons;

const getAllCourses = async () => {
    try {
        let response = await fetch(getcoursesURL);
        let courses = await response.json();

        for (let i = 0; i < courses.length; i++) {
            const element = courses[i];
            document.getElementById("courses").innerHTML +=
                `
                <div class="course"> 
                    <img src="${element.picture}" alt="Course Image">
                    <div class="title">${element.title}</div>
                    <div class="description">Course Description</div>
                    <div class="price">price :${JSON.stringify(element.price)} EGP</div>
                    <input data-id="${element._id}" type="button" value=" Buy Course" class="buyButton">
                </div>
                `;
        }

        buyButtons = Array.from(document.querySelectorAll(".buyButton"));
        console.log(buyButtons);

        buyButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // reserveCourse(button.dataset.id);
                
                addREQ(button.dataset.id);

            });
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const addREQ=async(id)=>{
try {
    let token = localStorage.getItem("token");
    console.log(token);
    console.log(id);
    if(token){  
        let data = {
            token: token,
            courseId: id,
        };
        // throw("errrrrrrrrr")
        const response = await fetch(addREQURL , { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            
        });
        
        if (await response.status == 401) {
            window.location.href = "login.html";
        } else if (await response.status == 200) {
            window.location.href="submit.html";
        }
    }     
    else{
        window.location.href = "signup.html";

    }  
} catch (error) {
    console.error('Error :', error);

}


}



const signup = async () => {
    try {
        const signForm = document.getElementById("signForm").elements;
        const data = {
            email: signForm.email.value,
            name: signForm.name.value,
            password: signForm.password.value,
            number: signForm.number.value,
            picture: signForm.picture.value,
            age: signForm.age.value
        };

        let response = await fetch(signupURL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            document.querySelector(".res").innerHTML=" invalid email "
        }

        let token = await response.json();
        console.log(token);
        localStorage.setItem("token", token);
        window.location.href = "index.html";
    } catch (error) {
        console.error('Signup error:', error);
    }
}

const login = async () => {
    try {
        const loginForm = document.getElementById("login-form").elements;
        let data = {
            email: loginForm.email.value,
            password: loginForm.password.value
        };

        console.log(data);

        let response = await fetch(loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if(!response.ok){
            document.querySelector(".res").innerHTML=" password or email is wrong"
        }
        const token = await response.json();
        console.log("tokeennnn",token);
        localStorage.setItem("token", token);
        window.location.href = "profile.html";
    } catch (error) {
        console.log("not found", error);
    }
}

const profile = async () => {
    try {
        console.log("run", localStorage.getItem("token"));
        const profile = document.querySelector(".profile");
        const coursesContainer = document.querySelector(".courses");
        const taskContainer = document.querySelector(".tasks");


        const data = {
            token: localStorage.getItem("token")
        }

        let response = await fetch(getUserURL, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (await response.status == 401) {
            window.location.href = "login.html";
        }

        const user = await response.json();
        console.log(" user data ", user.data);
        window.localStorage.setItem("email",user.data.oldClient.email)
        profile.innerHTML += `
            <div class="profile-details">
                <img src="default.jpg" alt="Profile Picture">
                <div class="user-info">
                    <h2>${user.data.oldClient.name}</h2>
                    <p>Age:${user.data.oldClient.age} </p>
                    <p>Occupation: programing student</p>
                </div>
            </div> 
        `;

        user.data.courses.forEach(element => {
            console.log(element);
            coursesContainer.innerHTML += `
                <div class="course" data-course_id=${element._id}>
                    <img src="${element.picture}" alt="Course Image">
                    <div class="course-details">
                        <h3>${JSON.stringify(element.title)}</h3>
                        <p>Instructor: abdullah mohamed</p>
                        <p>Description: A brief description of the course content goes here.</p>
                        <p>Progress:</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: 70%;"></div>
                        </div>
                    </div>
                </div>
            `;
        });

    let coursesElement=document.querySelectorAll(".course");
    console.log(coursesElement);
    coursesElement.forEach(e=>{
        e.addEventListener("click",()=>{
            console.log(e.dataset.course_id);
            localStorage.setItem("courseId",e.dataset.course_id);
            window.location.href="course.html";
        })
    })

    
    } catch (error) {
        console.error('Error in profile:', error);
    }
}
