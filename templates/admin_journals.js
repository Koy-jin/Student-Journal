const nav_add_topic = document.getElementById('nav-block-add-topic');
const input_topic = document.getElementById('input-add-topic');
const select_group = document.getElementById('select-group');
const table = document.getElementById('tbody-students');
const form_send_topic = document.getElementById('topic-form');
const div_switcher = document.getElementById('div-switcher-subject-btn');
const div_edd = document.getElementById('div-edd');
const div_m_options = document.getElementById('div-m-options');
const btn_mark_edd_push = document.getElementById('btn-marks-edit-push');
const nav_subject = document.getElementById('nav-subject');

div_m_options.style.display = 'none';
nav_add_topic.style.display = 'none';
div_switcher.style.display = 'none';
div_edd.style.display = 'none';

const current_role = urlParams.get('role')

let CURRENT_SUBJECT = null;
getGroups();



document.addEventListener('click', (event) => {
    const btn = event.target;
    if (btn.id === "btn-open-add-topic"){
        div_m_options.style.display = 'none';
        div_switcher.style.display = 'none';
        nav_add_topic.style.display = 'block';
    } 
    if (btn.id === "btn-marks-edit") {
        console.log('Редактируем оценку')
        div_m_options.style.display = 'none';
        div_switcher.style.display = 'none';
        div_edd.style.display = 'block';
        const current_grades = document.querySelectorAll('.current_grade')
        current_grades.forEach(grade => {
            grade.disabled = false;
        });
        
    } 
    if (btn.id === "btn-add-topic-cancel") {
        console.log('Закрыть меню')
        nav_add_topic.style.display = 'none';
        div_m_options.style.display = 'block';
        div_switcher.style.display = 'block';
        const text = document.getElementById('input-add-topic')
        text.value = "";
        text.textContent = "";
    } 
    if (btn.id === "btn-marks-edit-push"){
        
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
        div_edd.style.display = 'none';
        div_switcher.style.display = 'block';
        div_m_options.style.display = 'block';

    }
    if (event.target.classList.contains("switcher")){
        if ( current_role === "student") {
            div_m_options.style.display = 'none';
        } else { 
            div_m_options.style.display = 'block';
        }
        if (CURRENT_SUBJECT !== null){
            CURRENT_SUBJECT.disabled = false;
            CURRENT_SUBJECT.style.cursor = 'default';
            CURRENT_SUBJECT.style.backgroundColor = '';
        }
        console.log("ERRORRR")
        CURRENT_SUBJECT = event.target;
        CURRENT_SUBJECT.disabled = true;
        CURRENT_SUBJECT.style.backgroundColor = '#5b5b5b64';
        CURRENT_SUBJECT.style.cursor = 'not-allowed';
        
        const group_id = select_group.value;
        const subject_id = CURRENT_SUBJECT.value;
        const topic_name = input_topic.value;
        getTopics();
        

    }
    if ( event.target.id === "btn-marks-edit-cancel"){
        div_edd.style.display = 'none';
        div_m_options.style.display = 'block';
        div_switcher.style.display = "block";
        getMarks();
    }
    if ( event.target.id === "btn-delete-topic"){
        div_m_options.style.display = 'none';
        const div_delete_form = document.getElementById("div-delete-form");
        div_delete_form.style.display = 'block';
        div_switcher.style.display = 'none';
        const sl = document.getElementById('select-delete-topic');
        drawSelectForDelet(sl);
    }

    if ( event.target.id === "btn-accept-delete"){
        const div_delete_form = document.getElementById("div-delete-form");
        const sl = document.getElementById('select-delete-topic');
        div_m_options.style.display = 'block';
        div_delete_form.style.display = 'none';
        div_switcher.style.display = 'block';
        const g_id = select_group.value;
        const s_id = CURRENT_SUBJECT.value;
        const t_name = sl.value;
        deleteTopic(g_id, s_id, t_name);

    }
    if ( event.target.id === "btn-accept-delete-cancel"){
        div_m_options.style.display = 'block';
        const div_delete_form = document.getElementById("div-delete-form");
        div_delete_form.style.display = 'none';
        div_switcher.style.display = 'block';

    }
});



// Переключение групп
document.addEventListener('change', (event) =>{
    const select = event.target;
    console.log("ТУТУ")
    if (select.id === "select-group"){
        console.log("ТАМА")
        getGroup(select.value);
        const div_delet_form = document.getElementById('div-delete-form'); 
        div_switcher.style.display = 'block';
        div_m_options.style.display = 'none';
        div_edd.style.display = 'none';
        nav_add_topic.style.display = 'none';
        div_delet_form.style.display = 'none';

        group_id = parseInt(select.value);
        CURRENT_SUBJECT = null;
        getTopics();
    }
});

//Добавляем темы в базу данных
form_send_topic.addEventListener('submit', function(event){
        event.preventDefault()
        const group_id = select_group.value;
        const subject_id = CURRENT_SUBJECT.value;
        const topic_name = input_topic.value;
        addTopic(group_id, subject_id, topic_name)
        input_topic.value = "";
        input_topic.textContent = "";
        nav_add_topic.style.display = 'none';
        div_m_options.style.display = 'block';
        div_switcher.style.display = 'block';
});

// получаем группы(Устанавливаем глобальный селектор)
async function getGroups(){
    const request = await fetch(`http://127.0.0.1:8000/group/getall`);

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

    if (current_role === "admin") {
        const mark_putch = document.getElementById("btn-marks-edit");
        mark_putch.style.display = 'none';
    } else if ( role === 'teacher'){
    select_group.value = "N/A";
    } else if (current_role === 'student'){
    const id = urlParams.get('id')
    const u_id = parseInt(id);
    const g_id = u_id % 1000;
    select_group.value = g_id;
    nav_subject.style.display = "none";
    const sl = new Event('change', {bubbles: true});
    select_group.dispatchEvent(sl);
    }
};

//Получаем группы по ID(Получаем его при переключении свича групп )
async function getGroup(){
    const request = await fetch(`http://127.0.0.1:8000/group/get/${select_group.value}`);

    const data = await request.json();
    const success = data.success;
    const message = data.message;
    const students = data.data;
   
    await getCourse(group_id);
    await drawTableStudentColomn(students);
    
}

//Получаем набор предметов выбранной группы 
async function getCourse(group_id){
    const request = await fetch(`http://127.0.0.1:8000/course/get/${group_id}`);

    const data = await request.json();

    const success = data.success;
    const message = data.message;
    const course = data.data;

    div_switcher.innerHTML = "";
    if (course.length > 0){
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
    } else {
        const l = document.createElement('label');
        l.textContent = "Не назначено ни одного предмета";
        div_switcher.appendChild(l);
    }
}
// Получаем все темы выбранного предмета ()
async function getTopics(){
    const request = await fetch('http://127.0.0.1:8000/topic/getall');

    const data = await request.json();
    const success = data.success;
    const message = data.message;
    const topics = data.data
    if (topics){
        const GROUP_TOPIC = {};
        for (let topic of topics){
            const g_id = parseInt(topic.group_id);
            const sbj_id = parseInt(topic.subject_id);
            const t = topic.name;
            GROUP_TOPIC[g_id] = GROUP_TOPIC[g_id] || {};
            GROUP_TOPIC[g_id][sbj_id] = GROUP_TOPIC[g_id][sbj_id] || [];
            GROUP_TOPIC[g_id][sbj_id].push(t);

        }
        const t_h = document.getElementById('tr-headers');
        const r_h = t_h.rows[0];
        if (CURRENT_SUBJECT !== null ){
            if (Object.hasOwn(GROUP_TOPIC, select_group.value)){
                drawTableHeaders(GROUP_TOPIC)
                await getMarks()
            }
        } else {
            const t_h = document.getElementById("tr-headers");
            t_h.innerHTML = "";
        }
        //await getGroup(select_group.value);
        ;
        
    }

};
// Удаляем топик 
async function deleteTopic(g_id, s_id, t_name){
    const request = await fetch('http://127.0.0.1:8000/topic/delete', {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({group_id: g_id, subject_id: s_id, topic: t_name})
    });

    await getGroup(select_group.value);
    await getTopics();
    await getMarks();
}
// Добавляем поля оценок (Плейсхолдеры)
async function addMarks(subject_id, topic, group_id){
    const t_body = document.getElementById('tbody-students')
    if(t_body.rows.length > 0){
        const send_data = [];
        for (i = 0;  i < t_body.rows.length; i++ ){
            send_data.push({"student_id": t_body.rows[i].id, "grade": "0", "subject_id": subject_id, "topic": topic, "group_id": group_id });
        }
        const request = await fetch('http://127.0.0.1:8000/mark/addall', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({send: send_data})
        });
    }
    await getMarks();

};
// Добавляем темы. Перерисовываем таблицу 
async function addTopic(group_id, subject_id, topic_name){
    const request = await fetch('http://127.0.0.1:8000/topic/add',{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({g_id: group_id, s_id: subject_id, t_name: topic_name})
    });

    await addMarks(subject_id, topic_name, group_id);
    await getTopics();
    
};


async function getMarks(){
    const request = await fetch('http://127.0.0.1:8000//mark/getall');

    const data = await request.json();
    const success = data.success;
    const message = data.message;
    const marks = data.data;

    const ALL_MARKS = {};
    for (let mark of marks){
        const g_id = parseInt(mark.grp_id); // группа
        const subject_id = parseInt(mark.sub_id); // предмет
        const t_name = mark.t_name; // Тема
        const st_id = parseInt(mark.student_id); // Студент
        const grade = mark.grade; // Отметка

        ALL_MARKS[g_id] = ALL_MARKS[g_id] || {};
        ALL_MARKS[g_id][subject_id] = ALL_MARKS[g_id][subject_id] || {};
        ALL_MARKS[g_id][subject_id][t_name] = ALL_MARKS[g_id][subject_id][t_name] || {};
        ALL_MARKS[g_id][subject_id][t_name][st_id] = grade;

    }
    const t_h = document.getElementById('tr-headers');
    const r_h = t_h.rows[0];
    if (CURRENT_SUBJECT !== null && r_h.cells.length > 0) {
        await drawTableGrade(ALL_MARKS);
    }
}
async function putMark(){
    const request = await fetch('http://127.0.0.1:8000/mark/patch', {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({send: update_marks_list}),
    });
    await getMarks();
};

//Рисуем топики 
function drawTableHeaders(GROUP_TOPIC){
    const tr_headers = document.getElementById("tr-headers");
    tr_headers.innerHTML = "";
    const row = tr_headers.insertRow();
    const fio = row.insertCell();
    const s = CURRENT_SUBJECT.value;
    const g_id = select_group.value;
    const topics_list = GROUP_TOPIC[g_id][s];
    fio.textContent = "ФИО";
    if (topics_list){
        topics_list.forEach( t => {
            const newCell = row.insertCell();
            newCell.textContent = t;
        })
    }
    const A_S_cell = row.insertCell();
    A_S_cell.textContent = "Средний балл"  
};
// Рисуем студентов 
function drawTableStudentColomn(STUDENT_LIST){
    const tbody = document.getElementById("tbody-students");
    tbody.innerHTML = ""
    const g_id = select_group.value;
    for (const g of STUDENT_LIST){
        const newRow = tbody.insertRow();
        const newCell = newRow.insertCell();
        newCell.textContent = g.name;
        newRow.id = g.id;
    } 

}
// Рисуем оценки
function drawTableGrade(ALL_MARKS){
    const t_body = document.getElementById('tbody-students');
    const h_body = document.getElementById('tr-headers')
    const row_h = h_body.rows[0];
    
    // Очищаем таблицу до имен 
    for ( i = 0; i < t_body.rows.length; i++){
        const row = t_body.rows[i];
        console.log(row.cells.length, "Длинна")
        const l = row.cells.length;
        for (j = 1; j < l; j++ ){
            console.log(j, i, "УДАЛЯЕМ ТАБЛИЦУ")
            row.deleteCell(-1);
        }
    }
    


    const g_id = select_group.value;
    const s_id = CURRENT_SUBJECT.value;
    for (i = 0; i < t_body.rows.length; i++){
        const st = t_body.rows[i];
        const st_id = st.id
        for (j = 1; j < row_h.cells.length - 1; j++ ){
            const t_name = row_h.cells[j];
            const grade =  ALL_MARKS[g_id][s_id][t_name.textContent][st_id]
            const newCell = t_body.rows[i].insertCell();
            const sl = document.createElement('select');
            sl.className = "current_grade";
            sl.id = `sl-${g_id}-${s_id}-${t_name.textContent}-${st_id}`
            drawSelectGrade(sl);
            sl.value = grade;
            sl.disabled = true;
            newCell.appendChild(sl);
        }
    }
    average_score(t_body, row_h);

}

function drawSelectGrade(select){
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
            select.appendChild(op1);
            select.appendChild(op2);
            select.appendChild(op3);
            select.appendChild(op4);
            select.appendChild(op5);
            select.appendChild(op0);
}

function average_score(t_body, row_h){
    const group_id = select_group.value;
    const subject_id = CURRENT_SUBJECT.value;
    


    for ( let i = 0; i < t_body.rows.length; i++){
        let row = t_body.rows[i];
        let marks_sum = 0;
        let marks_count = 0
        for (let j = 1; j < row.cells.length; j++){
            let sl = row.cells[j].querySelector('.current_grade');
            let v = parseInt(sl.value);

            if (v !== 0){
                marks_count = marks_count +  1;
            }

            console.log(v, "<<<<<<=", marks_count);
            marks_sum += parseInt(v);
        }

        let sr = (marks_sum / marks_count);
        const newCell = row.insertCell(-1)

        if (Number.isNaN(sr)){
            newCell.textContent = "-";
        } else {
            newCell.textContent = sr.toFixed(2);
        }
        
    }

}
function drawSelectForDelet(select){
    select.innerHTML = "";
    const t_h = document.getElementById('tr-headers');
    const row = t_h.rows[0];

    for (i = 1; i < row.cells.length; i++){
        const newOp = document.createElement('option');
        newOp.value = row.cells[i].textContent;
        newOp.textContent = newOp.value;
        select.appendChild(newOp);
    }
}


