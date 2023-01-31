/*eslint-disable*/
   
import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
  console.log(res)
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

////-----------------------------------------------|||||||||-----////
// export const updateSettings = async (data, type) => {
  
//   console.log( email,password);
//   console.log("login");
// //type is either password or data
//   try {
//     const url = type === "password"
//       ?'/api/v1/users/updateMyPassword'
//        : '/api/v1/users/updateMe';
// const options = {
//   method: "PATCH",
//   body: JSON.stringify({
//    data
//   }),
//   headers: {
//     "Content-Type": "application/json; charset=UTF-8",
//   }
// };
//     // Send a POST request
//     const res = await fetch(url,options);
//     console.log(res)
//     //   const response = await request.json();
//     // if (res.status ===  200) {
//     //   showAlert(`${type.toUpperCase()}Data updated successfully`);
//     // }
//     if (res.statusText === "OK") {
//       showAlert("OK", `${type.toUpperCase()} updated successfully!`);
//     }
//   } catch (err) {
//     showAlert("error", err.response.data.message);
//   }
// };
///
    // export const updateSettings = async (type, data) => {
    //   const dt = { ...data };
    //   try {
    //     let url = "http://localhost:3000/api/v1/users/";
    //     url += type === "data" ? "updateMe" : "updatePassword";

    //     let response = await fetch(url, {
    //       method: "PATCH",
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //       body: JSON.stringify(dt),
    //     });
    //     if (!response.ok) throw response;
    //     let data = await response.json();

    //     if (data.status === "success") {
    //       window.location.reload(true);
    //       showAlert("success", `Updated User ${type.toUpperCase()} successfully`, 2000);
    //     }
    //   } catch (err) {
    //     err.text().then((errorMessage) => {
    //       showAlert("error", JSON.parse(errorMessage).message, 5000);
    //     });
    //   }
    // };

 