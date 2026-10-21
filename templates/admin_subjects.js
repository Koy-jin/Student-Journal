const text = document.querySelector("text");
const options = document.getElementById('nav-subject');
const createButton = document.getElementById('btn-create-subject');
const list_subject = document.getElementById('list-subject');
const name = document.createElement('input');
const accept = document.createElement('button');
accept.id = 'btn-accept-subject';
accept.textContent = "Добавить";

const len = list_subject.children.length;
if (len < 0) {
    text.style.display = "none"
}

name.style.display = "none";
accept.style.display = "none";
options.appendChild(name);
options.appendChild(accept);

document.addEventListener('click', event => {
    const btn = event.target;
    if (btn.id === createButton.id) {
        text.style.display = 'none';
        name.style.display = 'block';
        accept.style.display = 'block';
        createButton.style.display = "none"
    }
});

document.addEventListener('click', event => {
    const btn = event.target;
    if (btn.id === "btn-accept-subject"){
        if (name.value && name.value !== " "){
            console.log(`создан предмет: ${name.value}`);
            addSubject(name.value);
        }
        name.value = "";

        createButton.style.display = "block"
        name.style.display = 'none';
        accept.style.display = 'none';
       if (len < 0) {
            text.style.display = "none"
        } else {
            text.style.display = 'block';
        }
    } else {
    }
})

document.addEventListener('click', event =>{
    if (event.target === document.documentElement || event.target === document.body ){
        name.value = "";
        text.style.display = 'block';
        createButton.style.display = "block"
        name.style.display = 'none';
        accept.style.display = 'none';
    }
});


async function addSubject(subject){
    const response = await fetch("http://127.0.0.1:8000/add_subject",{
        method: "Post",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({subjects: subject})
    });

    const data = await response.json();
    getSubject();
};

async function getSubject(){
    const response = await fetch("http://127.0.0.1:8000/get_subject");

    const subjects = await response.json();
    const data = subjects["data"]
    list_subject.innerHTML = "Спислк предметов";

    for (const subject of data){
        const li = document.createElement('li');
        li.textContent = subject.name;
        console.log(subject.name)
        list_subject.appendChild(li)
    }
};
getSubject();