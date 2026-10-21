const btn_create_group = document.getElementById("btn-create-group");
const btn_add_group = document.getElementById("btn-add-group");
const input_name = document.getElementById("input-group-name");
const text_no_one_group = document.getElementById("text-no-one-group");
const t_body = document.querySelector('#table-student-list tbody')
const btn_add_subject = document.getElementById('btn-add-subject-on-group');

const courses_form = document.getElementById('courses-form');

const select_group = document.getElementById('select-group');
const select_subject = document.getElementById('select-subject');

const div_nav = document.getElementById('div-nav-btns')
const div_add_subject = document.getElementById('div-add-subject');
const div_add_group = document.getElementById('div-add-group')

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
        add_group(send_group);
    }
});


document.addEventListener('click', (event) => {
    if (event.target.id === "btn-add-subject-on-group"){
        div_add_subject.style.display = "block";
        div_nav.style.display = "none";



    }
});
/*
document.addEventListener('click', (event) => {
    if (event.target.id === "btn-add-courses"){
        const group_id = select_group.value;
        const subject_id = select_subject.value;
        addCourses(group_id, subject_id);

        div_add_subject.style.display = "none";
        div_nav.style.display = "block";
    }
});
*/

document.addEventListener('click', (event) => {
    if (event.target.className === "cancel"){
        div_add_group.style.display = "none";
        div_add_subject.style.display = "none";
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

    const row = document.getElementById(`row-${group_id}`);
    const cell = row.insertCell(-1);
    cell.id = `td-${group_id}`;
    cell.textContent = subject_name.textContent;

});

async function add_group(send_group){
    try {
        const response = await fetch("http://127.0.0.1:8000/addGroup", {
            method : "POST",
            headers : {'Content-Type':'application/json'},
            body: JSON.stringify({ groups: send_group})
        })
            const data = await response.json();

            if(!response.ok) {
                throw new ERROR(data.derail || data.message || "Произошла ошибка");
            }


    }catch(error) {
        showErrorOnForm(error.message);
        };
    };


async function get_groups(){

    const response = await fetch("http://127.0.0.1:8000/getAllGroup");

    const data = await response.json();
    const success = data.success;
    const message = data.message;
    const groups = data.groups;

    for (group of groups) {
        const text = group.name;
        const id = group.id;

        const op = document.createElement('option');
        op.id = `op-group-${id}`;
        op.value = id;
        op.textContent = text;

        const newRow = t_body.insertRow(-1);
        newRow.id = `row-${id}`;
        const cell_name = newRow.insertCell(0);

        cell_name.id = `td-${id}`;
        cell_name.textContent = text;
        select_group.appendChild(op);
    }


};

async function get_subject(){
    const response = await fetch("http://127.0.0.1:8000/get_subject");

    const data = await response.json();

    const success = data.success;
    const message = data.message;
    const subjects = data.data;

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

async function addCourses(group_id, subject_id){
    const response = await fetch("http://127.0.0.1:8000/addCourses", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({group: group_id, subject: subject_id })
    })
};

async function getCourses(){
    const response = await fetch("http://127.0.0.1:8000/getCourses");
    const data = await response.json();

    const success = data.success;
    const message = data.message;
    const courses = data.data;
    for (course of courses){
        const id = course.id;
        const name = course.name;
        console.log(name);
        const row = document.getElementById(`row-${id}`);

        const cell = row.insertCell(-1);
        cell.id = `td-${id}`;
        cell.value = name;
        cell.textContent = name;

    }


}
get_groups();
get_subject();
getCourses();

