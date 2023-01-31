/* eslint-disable*/

export const hideAlert = () => {
    const el = document.querySelector('.alert');
    //removing one element from the 
    if(el) el.parentElement.removeChild(el)
    
}


////
export const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const marKup = `<div class="alert alert--${type}"> ${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin' , marKup)
    console.log("show");
    window.setTimeout(hideAlert, time * 1000)
}