const btn_add_user = document.getElementById("btn-create-user");
const main_menu = document.getElementById("nav-user");
const text = document.getElementById("text-no-user");
const user_create_menu = document.getElementById("user-add-form");

const select_group = document.getElementById("select-group");
const select_role = document.getElementById("select-role")

const login = document.getElementById("input-login");
const password = document.getElementById("input-password");
const name = document.getElementById("input-name");

user_create_menu.style.display = "none";

document.addEventListener("click", event => {
    const btn_target = event.target;

   if (btn_target.id === "btn-create-user"){
        text.style.display = "none";
        user_create_menu.style.display = "block";
        btn_add_user.style.display = "none";

   }
});


document.addEventListener('click', event => {

// Дораьотать аллерты
    if (event.target.id === "btn-add-user"){


        const latinOnly = /^[a-zA-z0-9]+$/;
        const cyrillicOnly = /^[а-яА-ЯёЁ\s-]+$/;
        const hasNumber = /\d/;

        let isValid = true;


        if (login.value.length === 0) {
            showError(login, "#error-login", "Поле обязательно к заполнению")
            isValid = false
        } else {
            showError(login, "#error-login","");
        }

        if (password.value.length === 0) {
            showError(password, "#error-password", "Поле обязательно к заполнению")
            isValid = false
        } else {
            showError(password, "#error-password","");
        }

        if (name.value.length === 0) {
            showError(name, "#error-name", "Поле обязательно к заполнению")
            isValid = false
        } else {
            showError(name, "#error-name","");
        }

        if (!latinOnly.test(login.value)){
            showError(login, "#error-login", "Логин должен состоять из латинских символов" );
            isValid = false
        } else {
            showError(login, "#error-login", "");
        }

        if (login.value.length < 4){
            showError(login, "#error-login", "Логин должен состоять хотя бы из 4 символов" );
            isValid = false
        } else {
            showError(login, "#error-login", "");
        }

        if (!latinOnly.test(password.value)){
            showError(password, "#error-password", "Пароль должен состоять из латинских символов" );
            isValid = false
        } else {
            showError(password, "#error-password", "");
        }
        if (password.value.length < 6){
            showError(password, "#error-password", "Пароль должен состоять хотя бы из 6 символов" );
            isValid = false
        } else {
            showError(password, "#error-password", "");
        }
        if (!hasNumber.test(password.value)){
            showError(password, "#error-password", "В пароле должно быть хотя бы одно число" );
            isValid = false
        } else {
            showError(password, "#error-password", "");
        }

        if (!cyrillicOnly.test(name.value)){
            showError(name, "#error-name", "ФИО должно стостоять только из кирилических символов" );
            isValid = false
        } else {
            showError(name, "#error-name", "");
        }


        if (isValid){
            send_login = login.value;
            send_password = password.value;
            send_name = name.value;
            send_role = select_role.value;
            send_group = select_group.value;
            addUser(send_login, send_password, send_name, send_role, send_group);

            login.value = "";
            login.textContent = "";
            password.value = "";
            password.textContent = "";
            name.value = "";
            name.textContent = "";
            user_create_menu.style.display = "none";
            btn_add_user.style.display = "block";
            console.log("ERROR")
        }

    }
});

document.addEventListener('click', event =>{
    if (event.target === document.documentElement || event.target === document.body ){
        text.style.display = "block";
        user_create_menu.style.display = "none";
        btn_add_user.style.display = "block";
        login.value = "";
        password.value = "";
        name.value = "";
    }
});

/*document.addEventListener("change", (event) => {
    if (select_role.value === "admin" || select_role.value === "teacher"){
            select_group.option = "N/a";
        } else {
            select_group.value == "1";
            select_group.textContent = "1";
        }
});
*/

function showError(inputElement, errorElementId, massage){
    const errorSnap = user_create_menu.querySelector(errorElementId);

    if(massage){
        //inputElement.classList.add("invalid");
        errorSnap.textContent = massage;
    } else {
        //inputElement.classList.remove("invalid");
        errorSnap.textContent = "";
    }
};

async function addUser(login, password, name, role, group){
    const response = await fetch("http://127.0.0.1:8000/add_user", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({logins: login, passwords: password, names: name, rols: role, groups: group})
});
    const data = await response.json();

    if (response.ok){
        renderNewUserRow(name, group, role);
    } else {
        alert(data.message);
    }


   //const ans = await response.json()
};

async function getAllUsers(){
    const  response = await fetch("http://127.0.0.1:8000/getAllUsers");
    const user_data = await response.json();
    const success = user_data.success;
    const message = user_data.message;
    const data = user_data.data;

    const t_body = document.querySelector("#table-student-list tbody");
    t_body.innerHTML = "";
    console.log("ERROR 2")
    for (user of data) {
        console.log("ERROR 3")
        const name = user.name;
        const group = user.group;
        const role = user.role;


        const newRow = t_body.insertRow(-1);
        const cell_name = newRow.insertCell(0);
        const cell_group = newRow.insertCell(1);
        const cell_role = newRow.insertCell(2);



        cell_name.value = user.id;
        cell_name.textContent = user.user;


        if (user.group_name === null){
            cell_group.textContent = "Null";
        } else {
            cell_group.value = user.groups_id;
            cell_group.textContent = user.group_name;
        }

        cell_role.value = user.role;
        cell_role.textContent = user.role;

    }
    getGroups();
};

async function getGroups(){
    response = await fetch("http://127.0.0.1:8000/getAllGroup");

        const data = await response.json();

        const success = data.success;
        const message = data.message;
        const groups = data.groups;

        for (user of groups){
            const option_groups = document.createElement('option');

            option_groups.value = user.id;
            option_groups.textContent = user.name;

            select_group.appendChild(option_groups);
        }
};

function renderNewUserRow(name, group, role) {
    const tableBody = document.getElementById('table-student-list');
    if (!tableBody) return;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${group}</td>
        <td>${role}</td>
    `;
    tableBody.appendChild(newRow);
}
getAllUsers();
