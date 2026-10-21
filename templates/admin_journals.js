const nav_add_topic = document.getElementById('nav-block-add-topic');
const btn_nav_add_topic = document.getElementById('btn-open-add-topic');
const btn_add_topic = document.getElementById('btn-add-topic');
const btn_mark_edd = document.getElementById('btn-marks-edit');
const input_topic = document.getElementById('input-add-topic');
const select_group = document.getElementById('select-group');
const table = document.getElementById('tbody-students');
const table_all = document.getElementById('table');
const form_send_topic = document.getElementById('topic-form');
const div_switcher = document.getElementById('div-switcher-subject-btn');
const div_edd = document.getElementById('div-edd');
const btn_mark_edd_push = document.getElementById('btn-marks-edit-push');

nav_add_topic.style.display = 'none';
div_switcher.style.display = 'none';
div_edd.style.display = 'none';
btn_mark_edd_push.style.display = 'none';
let current_subject = null;

let student_list = [];
let groupTopic = {}
let marksAll = {};
getGroups();
getTopics();
getMarks();

document.addEventListener('click', (event) => {
    const btn = event.target;
    if (btn.id === "btn-open-add-topic"){
        nav_add_topic.style.display = 'block';
        btn_nav_add_topic.style.display = 'none';
    } else if (btn.id === "btn-marks-edit") {
        console.log('Редактируем оценку')
        const current_grades = document.querySelectorAll('.current_grade')
        current_grades.forEach(grade => {
            grade.disabled = false;
        });
        btn_mark_edd.style.display = 'none';
        btn_mark_edd_push.style.display = 'block';
    } else if (btn.id === "btn-add-topic1") {
        console.log('Закрыть меню')
        nav_add_topic.style.display = 'none';
        btn_nav_add_topic.style.display = 'block';
        const text = document.getElementById('input-add-topic')
        text.value = "";
        text.textContent = "";
    } else if (btn.id === "btn-marks-edit-push"){
        btn_mark_edd.style.display = 'block';
        btn_mark_edd_push.style.display = 'none';
        const current_grades = document.querySelectorAll('.current_grade')
        update_marks_list = [];
        current_grades.forEach(grade => {
            grade.disabled = true;
            const data = grade.id.split('-');
            const mark = grade.value;
            if (mark === 0){
                mark = "0"
            }
            let sm = {};
            const student_id = data[4];
            const sub_id = data[2];
            const t_name = data[3];
            const grp_id = data[1];
            sm["mark"] = mark;
            sm["student_id"] = student_id;
            sm["sub_id"] = sub_id;
            sm["t_name"] = t_name;
            sm["grp_id"] = grp_id
            update_marks_list.push(sm);
        });
        putMark(update_marks_list);
        // `sl-${group_id}-${subject_id}-${t}-${st_id}`;

    }
});
/*
document.addEventListener('click', (event) =>{
    const btn = event.target;

    if (btn.id === "btn-add-topic"){
        if (select_group.value !== "N/A"){
            btn_nav_add_topic.style.display = 'block';
            nav_add_topic.style.display = 'none';
            const topic = input_topic.value;
            console.log(`Тема ${topic} добавлена в предмет ${subject}`);
        } else {
            alert("Выберите группу")
        }
    }
});
*/
// Переключение предметов
document.addEventListener('click', (event) =>{
    if (event.target.classList.contains("switcher")){
        div_edd.style.display = 'block';
        if (current_subject !== null){
            current_subject.disabled = false;
            current_subject.style.cursor = 'default';
            current_subject.style.backgroundColor = '';

            getTopics();
            getMarks();
        }
        console.log("ERRORRR")
        current_subject = event.target;
        current_subject.disabled = true;
        current_subject.style.backgroundColor = '#cccccc';
        current_subject.style.cursor = 'not-allowed';
        btn_nav_add_topic.style.display  = 'block';

        const group_id = select_group.value;
        const subject_id = current_subject.value;
        const topic_name = input_topic.value;
        drawTable(groupTopic, marksAll);


    }
});

document.addEventListener('change', (event) =>{
    const select = event.target;
    if (select.id === "select-group"){
        div_switcher.style.display = 'block';
        group_id = parseInt(select.value, 10);
        table_all.innerHTML = "";
        getGroup(group_id);
        getCourse(group_id);

    }
});
//Добавляем темы в базу данных
form_send_topic.addEventListener('submit', function(event){
        event.preventDefault()
        const group_id = select_group.value;
        const subject_id = current_subject.value;
        const topic_name = input_topic.value;
        addTopic(group_id, subject_id, topic_name)
        input_topic.value = "";
        input_topic.textContent = "";

});


// получаем группы
async function getGroups(){
    const request = await fetch(`http://127.0.0.1:8000/getAllGroup`);

    const data = await request.json();

    const success = data.success;
    const message = data.message;
    const groups = data.groups;

    for (group of groups){
       const op = document.createElement('option');
       op.value = group.id;
       op.textContent = group.name;
       select_group.appendChild(op);

    }


};
//Получаем группы по ID
async function getGroup(group_id){
    const request = await fetch(`http://127.0.0.1:8000/getGroup/${group_id}`);

    const data = await request.json();
    const success = data.success;
    const message = data.message;
    const students = data.data;
    student_list = []
    const t_head = document.createElement("thead");
    const t_body = document.createElement('tbody');
    t_body.id = "tbody-students";
    const row_h = t_head.insertRow(0)
    t_head.id = "th-headers";
    const h_cell = row_h.insertCell(0);
    h_cell.textContent = "ФИО";
    table_all.appendChild(t_head);
    table_all.appendChild(t_body);
    for ( student of students){
        const name = student.name;
        const id = student.id;
        student_list.push(id);
        const newRow = t_body.insertRow(-1);
        const cell_name = newRow.insertCell(0);
        newRow.id = id;
        cell_name.value = id;
        cell_name.textContent = name;
    }
    console.log(student_list);
}

//Получаем набор предметов группы
async function getCourse(group_id){
    const request = await fetch(`http://127.0.0.1:8000/getCourse/${group_id}`);

    const data = await request.json();

    const success = data.success;
    const message = data.message;
    const course = data.data;

    div_switcher.innerHTML = "";
    for (subject of course){
        const subject_id = subject.subject_id;
        const subject_name = subject.name;
        const group_id = subject.id;

        const btn = document.createElement('button');
        btn.classList.add("switcher");
        btn.id = `btn-${subject_name}-${subject_id}`;
        btn.value = subject_id;
        btn.textContent = subject_name;

        div_switcher.appendChild(btn);

    }
}
// Получаем все темы
async function getTopics(){
    const request = await fetch('http://127.0.0.1:8000/getTopicsAll');

    const data = await request.json();
    const success = data.success;
    const message = data.message;
    const topics = data.data

    groupTopic = {};
    for (let topic of topics){
        const g_id = parseInt(topic.group_id);
        const sbj_id = parseInt(topic.subject_id);
        const t = topic.name;

        groupTopic[g_id] = groupTopic[g_id] || {};
        groupTopic[g_id][sbj_id] = groupTopic[g_id][sbj_id] || [];
        groupTopic[g_id][sbj_id].push(t);

    }



};
// Добавляем поля оценок (Плейсхолдеры)
async function addMarks(subject_id, topic, group_id){
    if(student_list.length > 0){
        const send_data = [];
        console.log('STUDENT_LIST', student_list, student_list.length);
        for (const student of student_list){
            send_data.push({"student_id": student, "grade": "0", "subject_id": subject_id, "topic": topic, "group_id": group_id });
        }
        const request = await fetch('http://127.0.0.1:8000/addMarks', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({send: send_data})
        });
    }

};
// Добавляем темы. Паралельно добавляются плйсходеры под оценки
async function addTopic(group_id, subject_id, topic_name){
    const request = await fetch('http://127.0.0.1:8000/addTopic',{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({g_id: group_id, s_id: subject_id, t_name: topic_name})
    });
    const row = document.getElementById('tr-headers');
    const cell = row.insertCell(-1);
    cell.id =`td-${group_id}-${subject_id}-${topic_name}`
    cell.textContent = topic_name;

    addMarks(subject_id, topic_name, group_id);


};


async function getMarks(){
    const request = await fetch('http://127.0.0.1:8000/getMarksAll');

    const data = await request.json();
    const success = data.success;
    const message = data.message;
    const marks = data.data;

    marksAll = {};
    for (let mark of marks){
        const g_id = parseInt(mark.grp_id); // группа
        const subject_id = parseInt(mark.sub_id); // предмет
        const t_name = mark.t_name; // Тема
        const st_id = parseInt(mark.student_id); // Студент
        const grade = mark.grade; // Отметка

        marksAll[g_id] = marksAll[g_id] || {};
        marksAll[g_id][subject_id] = marksAll[g_id][subject_id] || {};
        marksAll[g_id][subject_id][t_name] = marksAll[g_id][subject_id][t_name] || {};
        marksAll[g_id][subject_id][t_name][st_id] = grade;

    }
    return marksAll;

}
async function putMark(){
    const request = await fetch('http://127.0.0.1:8000/mark/patch', {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({send: update_marks_list}),
    });

};

function drawTable(topic, marks ){
// чистим строчку thead до ФИО (0)
    const table_hb = document.getElementById("table");

    for (let row of table_hb.rows){
        while (row.cells.length > 1){
            row.deleteCell(1);
        }
    }
//Берем выбранную группу из селекта
//Берем предмет из текущей кнопки
    const group_id = parseInt(select_group.value);
    const subject_id = parseInt(current_subject.value);
    const topics = topic?.[group_id]?.[subject_id] || [];


    for (let t of topics){
        const firstRow = table_hb.rows[0];
        const cell = firstRow.insertCell(-1);
        cell.textContent = t;
        for (let i = 1; i < table_hb.rows.length; i++){
            let row = table_hb.rows[i];
            const st_id = row.id;
            const current_grade = marks?.[group_id]?.[subject_id]?.[t]?.[st_id] || "";
            const newCell = row.insertCell(-1);
            newCell.id = `td-${group_id}-${subject_id}-${t}-${st_id}`;
            const sl = document.createElement('select');
            sl.className = "current_grade";
            sl.id = `sl-${group_id}-${subject_id}-${t}-${st_id}`;
            const op1 = document.createElement('option');
            const op2 = document.createElement('option');
            const op3 = document.createElement('option');
            const op4 = document.createElement('option');
            const op5 = document.createElement('option');
            const op0 = document.createElement('option');
            op1.value = 1;
            op1.textContent = 1;
            op2.value = 2;
            op2.textContent = 2;
            op3.value = 3;
            op3.textContent = 3;
            op4.value = 4;
            op4.textContent = 4;
            op5.value = 5;
            op5.textContent = 5;
            op0.value = 0;
            op0.textContent = "N/A"
            sl.appendChild(op1);
            sl.appendChild(op2);
            sl.appendChild(op3);
            sl.appendChild(op4);
            sl.appendChild(op5);
            sl.appendChild(op0);
            sl.value = parseInt(current_grade);
            sl.disabled = true;
            newCell.appendChild(sl);
        }
    }
    average_score();
};

function average_score(){
    const group_id = select_group.value;
    const subject_id = current_subject.value;
    const topics = groupTopic?.[group_id]?.[subject_id] || [];
    const marks_count = topics.length;

    for ( let i = 1; i < table_all.rows.length; i++){
        let row = table_all.rows[i];
        let marks_sum = 0;
        for (let j = 1; j < row.cells.length; j++){
            let sl = row.cells[j].querySelector('.current_grade');
            let v = sl.value;
            marks_sum += parseInt(v);
        }
        console.log("СР/ЗНАЧ", marks_sum, marks_count)
        let sr = marks_sum / marks_count;
        const newCell = row.insertCell(-1)
        newCell.textContent = sr;
    }

    /*marksAll[g_id][subject_id][t_name][st_id] = grade; */
}


