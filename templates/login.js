

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

    if (data.success){
        if (data.status === "student"){
            window.location.href = "user.html?id=" + l + "&login=" + l;
        } else if (data.status === "admin"){
            window.location.href = "admin.html?login=" + l;
        }
    } else {
        para.textContent = data.message;
        clearInputs();
    }
});