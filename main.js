if (typeof serverURL === 'undefined') {
    var serverURL = "https://server-wheat-five.vercel.app";
}

const getcoursesURL = serverURL + "/courses/getAllCourses";
const reservecourseURL = serverURL + "/clients/reserveCourse/"; // Removed ":id" from the URL
const signupURL = serverURL + "/clients/addclient";
const loginURL = serverURL + "/clients/login";
const getUserURL = serverURL + "/clients/getClient";
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
                    <img src="تنزيل.jpg" alt="Course Image">
                    <div class="title">${element.title}</div>
                    <div class="description">Course Description</div>
                    <div class="price">${element.price}</div>
                    <input data-id="${element._id}" type="button" value=" Buy Course" class="buyButton">
                </div>
                `;
        }

        buyButtons = Array.from(document.querySelectorAll(".buyButton"));
        console.log(buyButtons);

        buyButtons.forEach((button) => {
            button.addEventListener("click", () => {
                reserveCourse(button.dataset.id);
            });
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const reserveCourse = async (id) => {
    try {
        let token = localStorage.getItem("token");
        console.log(id);

        if (token) {
            // Reserve request 
            let data = {
                token: token,
                courseId: id,
            };

            const response = await fetch(reservecourseURL + id, { // Changed the URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log(await response.status);

            if (await response.status == 401) {
                window.location.href = "login.html";
            } else if (await response.status == 200) {
                window.location.href = "https://wa.me/message/ZTYNDKNVWOU4P1a";
            }
        } else {
            // Go to sign up page 
            window.location.href = "signup.html";
        }
    } catch (error) {
        console.error('Error reserving course:', error);
    }
}

const signup = async () => {
    try {
        const signForm = document.getElementById("signForm").elements;
        const data = {
            email: signForm.email.value,
            name: signForm.name.value,
            password: signForm.password.value,
            picture: signForm.picture.value
        };

        let response = await fetch(signupURL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

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

        const token = await response.json();
        console.log(token);
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

        profile.innerHTML += `
            <div class="profile-details">
                <img src="default.jpg" alt="Profile Picture">
                <div class="user-info">
                    <h2>${user.data.oldClient.name}</h2>
                    <p>Age: 22</p>
                    <p>Occupation: Back End Developer</p>
                </div>
            </div> 
        `;

        user.data.courses.forEach(element => {
            coursesContainer.innerHTML += `
                <div class="course">
                    <img src="تنزيل.jpg" alt="Course Image">
                    <div class="course-details">
                        <h3>${JSON.stringify(element.title)}</h3>
                        <p>Instructor: John Doe</p>
                        <p>Description: A brief description of the course content goes here.</p>
                        <p>Progress:</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: 70%;"></div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error in profile:', error);
    }
}
