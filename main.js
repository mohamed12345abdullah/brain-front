
const getcoursesURL="https://server-wheat-five.vercel.app/courses/getAllCourses";
const reservecourseURL="http://localhost:4000/clients/reserveCourse/:id";
const signupURL="http://localhost:4000/clients/addclient";
const loginURL="http://localhost:4000/clients/login";
const getUserURL="http://localhost:4000/clients/getClient";
let buyButtons;


const getAllCourses=async ()=>{

   let response = await fetch(getcoursesURL);
    response = await response.json();

    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        document.getElementById("courses").innerHTML+=
        `
        <div class="course"> 
        <div class="title "> ${element.title}  </div>
        <div class=" price"> ${element.price} </div>
        
        </div>
        <input data-id="${element._id}" type="button" value=" buy course" class="buyButton">

        `;
        
    }
    buyButtons= Array.from( document.querySelectorAll(".buyButton"));
    console.log(buyButtons);
    buyButtons.forEach((e)=>{
        e.addEventListener("click",()=>{
            reservecourse(e.dataset.id);
        })
        })
}


const reservecourse=async(id)=>{
    let token=localStorage.getItem("token");
    console.log(id);
    if(token){
        // reserve request 
        let data={
            token:token,
            courseId:id,
        }
      
        const response=await fetch(reservecourseURL,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(data),
        })
        console.log(await response.status);
        if (await response.status==401) {
            window.location.href="login.html";
        }else if(await response.status==200){
            window.location.href="https://wa.me/message/ZTYNDKNVWOU4P1a";
        }
    
    }else{
        // goto sign up page 
        window.location.href="signup.html";
    }
}


const signup=async()=>{

    const signForm =document.getElementById("signForm").elements;
    const data={
        email:signForm.email.value,
        name:signForm.name.value,
        password:signForm.password.value,
        picture:signForm.picture.value
    }
    let response=await fetch(signupURL,{
        method:"post",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
    let token= await response.json();
    console.log(token);
    localStorage.setItem("token",token);
    window.location.href="index.html";

}


const login=async()=>{
    const loginForm=document.getElementById("login").elements;
    let data={
        email:loginForm.email.value,
        password:loginForm.password.value
    }

    let response= await fetch(loginURL,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })

    const token=await response.json();
    console.log(token);
    localStorage.setItem("token",token);
    window.location.href="profile.html";
}


const profile=async()=>{
    console.log("run",localStorage.getItem("token"));
    const profile= document.querySelector(".profile");
    const courses= document.querySelector(".courses");
    const data={
        token:localStorage.getItem("token")
    }

    let response= await fetch(getUserURL,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    if (await response.status==401) {
        window.location.href="login.html";
    }
    const user=await response.json();
    // console.log(" user data ",user.status);
    profile.innerHTML+=`
    <div class="image">
    <img src="../../default.jpg" alt="not found">
    </div>
    

    `;
{/* <div class="name"> name : ${user.data.oldClient.name}</div> */}
    user.data.courses.forEach(element => {
        courses.innerHTML+=`
        <div class="course">
        <img src="../تنزيل.jpg" alt="">

            ${JSON.stringify(element.title)}
        </div>
        `
    });


    user.data.oldClient.tasks.forEach(e=>{
        courses.innerHTML+=`
        <div class="tasks">
        ${e.json()}
        </div>
        `
    })


}