

// /* eslint disable */
// import axios from 'axios';
// import { showAlert } from "./alert";
// export const login = async (email, password) => {
//     console.log(email,password)
//     console.log('login')
  
//     try{
        
//     // http://127.0.0.1:3000/api/v1/users/login
//     // http://localhost:3000/api/v1/users/login
//   // Send a POST request
//   const request = await fetch("http://localhost:3000/api/v1/users/login", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email,
//       password,
//     }),
//   });
//   const response = await request.json();
//   console.log(response)
//     if (response.status === "success") {
//       showAlert("success", "Logged in successfully!");
//       // go to home page
//       window.setTimeout(() => {
//         location.assign("/views");
//       }, 500);
//     }
// } catch(err){
//       showAlert('error',err.response.data.message); 
// }
// }

// //logout function
// // export const logout = async () => {
// //   try{
// //     // const res = await fetch('http://localhost:3000/api/v1/users/logout',{
// //     //   method: 'GET'
      
// //     // }); 
// //     const res = await fetch("http://localhost:3000/api/v1/users/logout", {
// //       method: "GET",
// //     });
// //     console.log(res)
// //     if((res.status === 200)) location.assign("/login")
// //     //  if(res.status === )
// //   }catch(err){
// //     showAlert('error','Error logging out try again') 
// //     // console.log(err)
// //   }
// // }
// //using Axios
// ////
// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: "GET",
//       url: "http://localhost:3000/api/v1/users/logout",
//     });
//     if ((res.data.status = "success")) location.reload(true);
//   } catch (err) {
//     console.log(err.response);
//     showAlert("error", "Error logging out! Try again.");
//   }
// };
// //-------------------------//
// //
// // export const login = async (email,password) => {
// //     alert("logged IN")
// // console.log('Logged In');
// // console.log(email,password)
// //     try{
// //      alert(email,password)
// // const res =  await axios({
// //         method:'POST',
// //         url: 'http://localhost:3000/api/v1/users/login',
// //         data: {
// //             email,
// //             password,
// //              withCredentials: true
// //         }
// //     });
// //     //checking if our api call was successfull
// //     if(res.data.status === 'success'){
// //         alert('Logged In successfully');
// //         window.setTimeout(() => {
// //             //using location.assign to load another page
// //             location.assign('/')
// //         }, 1500)
// //     }
 
// // }catch(err){
// //     alert(err.response.data.message)
// // }
// // }

    
/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
  
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/views');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout'
    });
    // console.log(res)
    if ((res.data.status = 'success')) location.assign('/login');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};