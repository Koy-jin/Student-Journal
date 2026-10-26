const btn_create_group = document.getElementById("btn-create-group");
const btn_add_group = document.getElementById("btn-add-group");
const input_name = document.getElementById("input-group-name");
const text_no_one_group = document.getElementById("text-no-one-group");
const btn_add_subject = document.getElementById('btn-add-subject-on-group');

const courses_form = document.getElementById('courses-form');

const select_group = document.getElementById('select-group');
const select_subject = document.getElementById('select-subject');

const div_nav = document.getElementById('div-nav-btns');
const div_add_subject = document.getElementById('div-add-subject');
const div_add_group = document.getElementById('div-add-group');
const table = document.getElementById('table-course-list');
const tbody = document.getElementById('tbody-course-list');

const btn_delete_group = document.getElementById('btn-delet-group');
const delete_form = document.getElementById('group-fro-delete');
const select_for_delet = document.getElementById('select-for-delete');

delete_form.style.display = "none";
div_add_group.style.display = "none";
div_add_subject.style.display = "none";

text_no_one_group.style.display = "none";




document.addEventListener('click', (event) => {
    if (event.target.id === "btn-create-group"){
        div_add_group.style.display = "block";
        div_add_subject.style.display = "none";
        div_nav.style.display = "none";

    }
});

document.addEventListener('click', (event) => {
    if (event.target.id === "btn-add-group"){
        console.log("ERROR")
        const send_group = input_name.value;
        input_name.value = "";
        input_name.textContent = "";
        div_nav.style.display = "block";
        div_add_subject.style.display = "none";
        div_add_group.style.display = "none";
        add_group(send_group);
    }

    if (event.target.className === "btn-delete-x"){
        const scr = event.target.id;
        const arr_id = scr.split("-");
        g_id = parseInt(arr_id[0])
        s_id = parseInt(arr_id[1])
        deletSubjectFromCourse(g_id, s_id);
        getCourses();
    }

    if (event.target.id === btn_delete_group.id){
        div_nav.style.display = 'none';
        delete_form.style.display = 'block';
        
        

    }
    if ( event.target.id === "accept-delete"){
        console.log(select_for_delet.value)
        deletGroup(select_for_delet.value)
    }
});


document.addEventListener('click', (event) => {
    if (event.target.id === "btn-add-subject-on-group"){
        div_add_subject.style.display = "block";
        div_nav.style.display = "none";



    }
});

document.addEventListener('click', (event) => {
    if (event.target.className === "cancel"){
        div_add_group.style.display = "none";
        div_add_subject.style.display = "none";
        delete_form.style.display = "none";
        div_nav.style.display = "block";
    }
});


courses_form.addEventListener('submit', function(event){
    event.preventDefault();

    const group_id = select_group.value;
    const subject_id = select_subject.value;
    const subject_name = document.getElementById(`op-subject-${subject_id}`)
    addCourses(group_id, subject_id);

    div_add_subject.style.display = "none";
    div_nav.style.display = "block";
    console.log("YERF")
    getCourses();

});

// Добавляем группу 
async function add_group(send_group){
    try {
        const response = await fetch("http://127.0.0.1:8000/group/add", {
            method : "POST",
            headers : {'Content-Type':'application/json'},
            body: JSON.stringify({ groups: send_group})
        })
            const data = await response.json();

            if(!response.ok) {
                throw new ERROR(data.derail || data.message || "Произошла ошибка");
            }

        await get_groups()
        await getCourses();

    }catch(error) {
        showErrorOnForm(error.message);
        };
    
    };


// Берем все группы 
async function get_groups(){

    const response = await fetch("http://127.0.0.1:8000/group/getall");

    const data = await response.json();
    const success = data.success;
    const message = data.message;
    const groups = data.groups;

    drawSelector(groups);
    getCourses()

};

// Берем все предметы 
async function get_subject(){
    const response = await fetch("http://127.0.0.1:8000/subject/get");

    const data = await response.json();

    const success = data.success;
    const message = data.message;
    const subjects = data.data;
    if (success){
    for (subject of subjects){
        const id = subject.id
        const name = subject.name;

        const op = document.createElement('option');
        op.id = `op-subject-${id}`;
        op.value = id;
        op.textContent = name;

        select_subject.appendChild(op);
    }

    }
}

// создаем курс 
async function addCourses(group_id, subject_id){
    const response = await fetch("http://127.0.0.1:8000/course/add", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({group: group_id, subject: subject_id })
    })
    await getCourses();
};

// берем все курсы + группы. В ответе должно быть ID группы, ID, предмета, ID курса, название предмета, название группы 
async function getCourses(){
    const response = await fetch("http://127.0.0.1:8000/course/getall");
    const data = await response.json();

    const success = data.success;
    const message = data.message;
    const courses = data.data;
    const current_data = {};
    for(let d of courses){
        const g_name = d.s_groups_name; 
        const s_name = d.subject_name;
        const g_id = d.s_groups_id;
        const s_id = d.subject_id;
        
        current_data[g_name] = current_data[g_name] || {};
        current_data[g_name].id = g_id;
        current_data[g_name]["course"] = current_data[g_name]["course"] || {};
        current_data[g_name]["course"][s_id] = s_name;
        
    }
    console.log(current_data);
    await drawTable(current_data);
}

async function deletSubjectFromCourse(g_id, s_id) {
    const response = await fetch("http://127.0.0.1:8000/course/subject/delete", {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({group_id: g_id, subject_id: s_id })
    })
    await getCourses();
    
}

async function deletGroup(g_id) {
    const response = await fetch("http://127.0.0.1:8000/group/delete", {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({group_id: g_id})
    })
    get_groups();
}

function drawSelector(groups){
    select_for_delet.innerHTML = "";
    select_group.innerHTML = "";
    for (group of groups) {
        const text = group.name;
        const id = group.id;

        const op = document.createElement('option');
        op.id = `op-group-${id}`;
        op.value = id;
        op.textContent = text;
        select_group.appendChild(op);
        const op_d = document.createElement('option');
        op_d.id = `op-d-${id}`;
        op_d.value = id;
        op_d.textContent = text; 
        select_for_delet.appendChild(op_d);
    }
}

function drawTable(current_data){
    tbody.innerHTML = "";

    for (const d in current_data){
        table.appendChild(tbody)
        const row = tbody.insertRow();
        if (current_data.hasOwnProperty(d)){
            const cell = row.insertCell();
            cell.textContent = d;
            c = current_data[d]
            for (const subject in c.course){
                if (c.course.hasOwnProperty(subject)){
                    const subCell = row.insertCell();
                    const btnDel = row.insertCell();
                    const btn = document.createElement('button');
                    btn.textContent = "x";
                    btn.className = 'btn-delete-x';
                    btn.id = `${current_data[d].id}-${subject}`;  
                    btnDel.appendChild(btn);
                    btnDel.className = "delete-cell";
                    subCell.textContent = c.course[subject];
                }
            }
        }
    }


}

get_groups();
get_subject();
getCourses();

