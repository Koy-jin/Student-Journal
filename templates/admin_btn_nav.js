const urlParams = new URLSearchParams(window.location.search);
const login_id = urlParams.get('login');
const role = urlParams.get('role')

if (role !== "admin"){
    const nav_h = document.getElementById("h-menue");
    nav_h.style.display = 'none';
}
document.addEventListener('click', event => {
    btn_id = event.target.id;
    console.log(btn_id);
    if (btn_id === "btn-log-out") {
        window.location.href = "index.html";
    } else if (btn_id === "btn-nav-journal") {
        window.location.href = `journal.html?login=${login_id}&role=${role}`;
    } else if (btn_id === "btn-nav-users") {
        window.location.href = `admin_users.html?login=${login_id}&role=${role}`;
    } else if (btn_id === "btn-nav-groups") {
        window.location.href = `admin_groups.html?login=${login_id}&role=${role}`;
    } else if (btn_id === "btn-nav-subjects") {
        window.location.href = `admin_subjects.html?login=${login_id}&role=${role}`;
    }
});