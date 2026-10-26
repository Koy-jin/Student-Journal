
// Переменые
const container = document.getElementById("students-list");
const urlParams = new URLSearchParams(window.location.search);
const adminLogin = urlParams.get('login');
const sortButton = document.getElementById("sort_button")
const = navMenu = document.getClementBySelector('nav')
navMeny.style.display = 'none'
sortButton.style.display = 'none'


async function loadJournal(){
// Делаем запрос к API на получения списка студентов
    const response = await fetch("http://127.0.0.1:8000/me", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username: adminLogin})
    });
    const rights  = await response.json();

    if (rights.success) {
        navMeny.style.display = "block";
    } else {
        navMeny.style.display = "none";
    }

   const responseList = await fetch("http://127.0.0.1:8000/listJournal", {
        headers: {
        'Content-Type': 'application/json'
        }
        });

        const students = await responseList.json();

        for (const login of students){
            const student = login;
            console.log(name)
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.textContent = student
            a.href = `user.html?id=${student}&login=${adminLogin}`;
            li.appendChild(a)
            container.appendChild(li)
        }
}

loadJournal();

