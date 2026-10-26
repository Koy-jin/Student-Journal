const btn_add_user = document.getElementById("btn-create-user");
const main_menu = document.getElementById("nav-user");
const text_allert = document.getElementById("text-no-user");
const user_create_menu = document.getElementById("user-add-form");

const select_group = document.getElementById("select-group");
const select_role = document.getElementById("select-role")

const login = document.getElementById("input-login");
const password = document.getElementById("input-password");
const name = document.getElementById("input-name");


let G_LIST = {};
user_create_menu.style.display = "none";
drawRoleSelector(select_role);



document.addEventListener('click', event => {
        const div_m_btns = document.getElementById('btn-option');
        const div_options = document.getElementById('btns-push-options');
// Доработать аллерты

    if (event.target.id === "btn-create-user"){
        user_create_menu.style.display = "block";
        div_m_btns.style.display = "none";

   }
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
            if (send_group === "0" || send_group === 0){
                send_group = null
            }
            if (send_role === "admin" || select_role === "teacher"){
                send_group = null
            }
            addUser(send_login, send_password, send_name, send_role, send_group);

            login.value = "";
            login.textContent = "";
            password.value = "";
            password.textContent = "";
            name.value = "";
            name.textContent = "";
            user_create_menu.style.display = "none";
            div_m_btns.style.display = "block";
        }

    }
    if (event.target.className === "btn-delete-x"){
        const btn_id = event.target.id;
        const u_id = btn_id.split("-")[1];
        userDelete(u_id);
    }
    if (event.target.id === "btn-cancel-user"){
        user_create_menu.style.display = "none";
        div_m_btns.style.display = "block";
    }
    if (event.target.id === "btn-edit-users"){
        div_m_btns.style.display = 'none';
        div_options.style.display = 'block';
        const r_select = document.querySelectorAll('.slct-r');
        r_select.forEach( select => {
            select.disabled = false;
        })
        const g_select = document.querySelectorAll('.slct-g');
        g_select.forEach( select => {
            select.disabled = false;
        })
    }

    if (event.target.id === "btn-edit-cancel"){
        div_m_btns.style.display = 'block';
        div_options.style.display = 'none';
        getAllUsers();
    }
    
    if (event.target.id === "btn-push"){
        const data = [];
        const tb_users = document.getElementById('tb-user');
        div_m_btns.style.display = 'block';
        div_options.style.display = 'none';
        Array.from(tb_users.rows).forEach( row => {
            u_id = row.id
            g_id = row.cells[1].children[0].value,
            r = row.cells[2].children[0].value
            if (g_id === '0' ){
                g_id = null;
            }
            if (r === "admin" || r ==="teacher"){
                g_id = null;
            }
            data.push({
                id: u_id,
                group_id: g_id,   
                role: r 
            });
        })
        console.log(data, "asdasdfasd");
        usersDataUpdate(data);
    }
});



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
    const response = await fetch("http://127.0.0.1:8000/user/add", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({logins: login, passwords: password, names: name, rols: role, groups: group})
});
    const data = await response.json();

    if (response.ok){
    } else {
        alert(data.message);
    }
    await getAllUsers();
};

async function getAllUsers(){
    const response = await fetch("http://127.0.0.1:8000/user/getall");
    const user_data = await response.json();
    const success = user_data.success;
    const message = user_data.message;
    const data = user_data.data;
    if (data.length > 0 ){
        text_allert.style.display = 'none';
    } else { 
        text_allert.style.display = 'block';
    }
    await getGroups();
    await drawTable(data)
};

async function getGroups(){
        const response = await fetch("http://127.0.0.1:8000/group/getall");

        const data = await response.json();

        const success = data.success;
        const message = data.message;
        const groups = data.groups;

        G_LIST = {}
        if (groups){
            for (user of groups){
                G_LIST[user.id] = user.name;
                
            }
        }
        console.log(G_LIST)
        drawGroupSelector(G_LIST, select_group);
};

async function usersDataUpdate(data) {
    const response = await fetch("http://127.0.0.1:8000/user/patchall", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({users: data})
    }); 

    await getAllUsers();
    
}
async function userDelete(u_id) {
    const response = await fetch("http://127.0.0.1:8000/user/delete",{
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user: u_id})
    });
    await getAllUsers();
}
function drawTable(data) {
    const tbody = document.getElementById('tb-user');
    tbody.innerHTML = "";
    for (const d of data){
        const g_select = document.createElement('select');
        const r_select = document.createElement('select');
        g_select.className = "slct-g";
        r_select.className = "slct-r";
        drawGroupSelector(G_LIST, g_select);
        drawRoleSelector(r_select);
        const u_id = d.id;
        const u_name = d.user;
        const g_id = d.groups_id;
        const g_name = d.groups_name;
        const role = d.role;

        const row = tbody.insertRow();
        const u_name_cell = row.insertCell();
        const g_name_cell = row.insertCell();
        const role_cell = row.insertCell();
        row.id = u_id;
        u_name_cell.textContent = u_name;
        role_cell.value = role;
        g_name_cell.value = g_id;
        console.log(g_id);
        if (g_id === null){
            g_select.value = 0;
            
        } else {
            g_select.value = g_id;
        }
        g_name_cell.appendChild(g_select);

        g_select.disabled = true;
        r_select.value = role; 
        role_cell.appendChild(r_select);
        r_select.disabled = true;
        const delete_user_cell = row.insertCell();
        delete_user_cell.className = 'delete-cell';
        const btn_delete_user = document.createElement("button");
        btn_delete_user.textContent = "x";
        btn_delete_user.id = `btn-${u_id}`;
        btn_delete_user.className = "btn-delete-x";
        delete_user_cell.appendChild(btn_delete_user);   
    }
    
}

function drawGroupSelector(g_list, slct){
    slct.innerHTML = "";
    for (const g in g_list){
        const op = document.createElement('option');
        op.id = `op-${g}`;
        op.value = g;
        op.textContent = g_list[g];
        slct.appendChild(op);
    }
    const op_NA = document.createElement('option');
    op_NA.value = "0";
    op_NA.textContent = "N/A";
    slct.appendChild(op_NA);
}

function drawRoleSelector(slct){
    slct.innerHTML = "";
    const admin = document.createElement("option");
    const teacher = document.createElement("option");
    const student = document.createElement("option");

    admin.value = "admin";
    teacher.value = "teacher";
    student.value = "student";

    admin.textContent = "Администратор";
    teacher.textContent = "Преподаватель";
    student.textContent = "Студент"
    slct.appendChild(admin);
    slct.appendChild(teacher);
    slct.appendChild(student);
}
getAllUsers();
getGroups();
