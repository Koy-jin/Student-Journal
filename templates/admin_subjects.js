const options = document.getElementById('nav-subject');
const createButton = document.getElementById('btn-create-subject');
const subject_name = document.getElementById('subject-name');
const accept = document.getElementById('btn-accept-subject');
const allert_text = document.getElementById('allet-text');

const table = document.getElementById("table");
const thead = document.getElementById('th-headers');
const tbody = document.getElementById('tbody-subject');
const div_form = document.getElementById('div-nav-form');
const div_m = document.getElementById('div-nav');


const subjectsList = [];



document.addEventListener('click', event => {
    const btn = event.target;
    if (btn.id === createButton.id) {
        div_m.style.display = 'none';
        div_form.style.display = "block"
    } else if (btn.className === "btn-delete-x") {
        deleteSubject(btn.value);
    }

    if (btn.className === "cancel"){
        div_m.style.display = 'block';
        div_form.style.display = "none";
    }
});

document.addEventListener('click', event => {
    const btn = event.target;
    if (btn.id === "btn-accept-subject"){
        if (subject_name.value && subject_name.value !== " "){
            console.log(`создан предмет: ${subject_name.value}`);
            addSubject(subject_name.value);
        }
        subject_name.value = "";
        div_m.style.display = 'block';
        div_form.style.display = "none";
    }   
})



async function addSubject(subject){
    const response = await fetch("http://127.0.0.1:8000/subject/add",{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({subjects: subject})
    });

    const data = await response.json();
    getSubject();
    drawTable();
};

async function getSubject(){
    const response = await fetch("http://127.0.0.1:8000/subject/get");

    const subjects = await response.json();
    const message = subjects["message"]
    const data = subjects["data"]
    subjectsList.length = 0;
    if (data){
        for (let subject of data){
        subjectsList.push(subject.name)
        console.log(subject.name)
    }
    console.log(subjectsList);
    }
    drawTable(subjectsList);
    if (message === "Success"){
        allert_text.style.display = 'none';        
    } else { 
        allert_text.style.display = 'block';
    }
};

async function deleteSubject(subject_name) {
    const response = await fetch("http://127.0.0.1:8000/subject/delete", {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({name: subject_name})
    });
    await getSubject();
}
function drawTable(){
    tbody.innerHTML = "";
    console.log('ERRROR');
    console.log(subjectsList);
    for (let subject of subjectsList ){
        table.appendChild(tbody);
        const row = tbody.insertRow();
        const cell = row.insertCell();
        const deleteSubject = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteSubject.className = "delete-cell";
        deleteButton.textContent = "x";
        deleteButton.value = subject;
        deleteButton.className = "btn-delete-x"
        deleteSubject.appendChild(deleteButton);
        console.log(subject);
        cell.textContent = subject;
    }
};
getSubject();