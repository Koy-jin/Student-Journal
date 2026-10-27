

// переменные
const btn = document.querySelector("button");
const login = document.getElementById("login");
const password = document.getElementById("password");
const para = document.getElementById("massage");

//функция очистки при неправильном логине
function clearInputs() {
        login.value = "";
        password.value = "";
        login.focus();
}

// Кнопка логина
btn.addEventListener("click", async function(){
    const l = login.value;
    const p = password.value;

    const response = await fetch("http://127.0.0.1:8000/login",{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({username: l, password: p}) // упаковка данных
    });
    const data = await response.json();
    const role = data.status;
    const us_data = data.data;
    console.log(us_data);
    if (data.status){
        let id = parseInt(us_data.id) * 10000
        if (role === "student"){
            id = id + parseInt(us_data.group_id); 
            window.location.href = `journal.html?id=${id}&role=${role}`;
        } else if (role === "admin"){
            window.location.href = `admin.html?id=${id}&role=${role}`;
        } else if ( role === "teacher"){
             window.location.href = `journal.html?id=${id}&role=${role}`;
        }
    } else {
        para.textContent = data.message;
        clearInputs();
    }
});