from os import name

from flask import Flask, request, jsonify
from flask_cors  import CORS
from mysql.connector import errors
from pyexpat.errors import messages

from db_worker import DataBaseWorker

app = Flask(__name__)
CORS(app)

db_worker = DataBaseWorker()

@app.route('/login', methods=['POST'])
def login_user():
    # полукчаем JSON-данные, которые прислал fetch из JS
    data = request.get_json()

    login = data.get('username')
    password = data.get('password')
    USER_DATABASE = db_worker.authorization(login)
    if login == USER_DATABASE["login"]:
        if USER_DATABASE["password"] == password:
            return jsonify({
                "success": True,
                "status": USER_DATABASE["role"],
                "message": "Успешный вход"
            })
        return jsonify({
            "success": False,
            "message": "В доступе отказано или неверный пароль"
        })
    return jsonify({
        "success": False,
        "message": "В доступе отказано или неверный пароль"
    })


# Проверка на правла
@app.route('/me', methods=['POST'])
def me():
    data = request.get_json()
    login = data.get('username')
    USER_DATABASE = db_worker.authorization(login)
    if USER_DATABASE["role"] == "admin":
        return jsonify({
            "success": True
        })
    return jsonify({
        "success": False
        })
    return None


@app.route('/listJournal<int:group_id>', methods=['GET'])
def list_journal(group_id):

    journal_data = db_worker.get_user_data(group_id)
    return journal_data

@app.route('/add_subject', methods=['POST'])
def add_subject():
    data = request.get_json()
    name = data.get('subjects')
    db_worker.add_subject((name,))
    return jsonify({
        "success": True,
        "message": "success"
    }), 200

@app.route('/get_subject', methods=['GET'])
def get_subject():
    data = db_worker.get_subjects_db()
    print(data, "ERROR")
    if data:
        return jsonify({
            "success": True,
            "message": "success",
            "data": data
        }), 200
    return jsonify({
        "success": False,
        "message": "БД пуста"
    }), 404

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    login = data.get('logins')
    password = data.get('passwords')
    name = data.get('names')
    role = data.get('rols')
    group = data.get('groups')
    if group == "N/a":
        group = None

    if db_worker.add_studentCheckLogin(login):
        db_worker.add_student(name, password, role, group, login)
        return jsonify({
            "success": "ok",
            "message": "Пользователь добавлен"
        })
    else:
        print("ERROR фываф")
        return jsonify({
            "success": "no",
            "message" : "Такой пользователь уже существует"
        })

@app.route('/addGroup', methods=['POST'])
def add_group():
    data = request.get_json()
    name1 = data.get("groups")
    try:
        db_worker.add_group(name1)
        return jsonify({"status":"success"}), 201
    except errors.IntegrityError as err:
        if err.errno == 1062:
            return jsonify({
                "status": "Conflict",
                "message": "Такая группа уже сущуствует"
         }), 409
        return jsonify({"error" : "Bad Request"}), 400

@app.route('/getAllGroup', methods=['GET'])
def get_all_group():
    groups_list = db_worker.get_all_groups()
    print(groups_list)
    if groups_list:
        return jsonify({
            "success": True,
            "message": "Успешно",
            "groups": groups_list})
    return jsonify({
        "success": False,
        "message": "Данных ещё нет"
    })
@app.route('/getAllUsers', methods=['GET'])
def get_all_users():
    user_data = db_worker.get_all_user_data()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": user_data
    })

@app.route('/getTopicsAll', methods=['GET'])
def get_all_topics():
    data = db_worker.get_all_topics()
    print(data)
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/getGroup/<int:group_id>', methods=['GET'])
def get_group(group_id):
    data = db_worker.get_group(group_id)
    return jsonify({
        "success": True,
        "message": "success",
        "data": data
    })

@app.route('/addCourses', methods=['POST'])
def add_courses():
    data = request.get_json()
    group_id = data.get("group")
    subject_id = data.get("subject")
    db_worker.add_course(group_id, subject_id )
    return jsonify({
        "success" : True,
        "message": "Success"
    })

@app.route('/getCourses', methods=['GET'])
def get_courses():
    data = db_worker.get_courses()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })
@app.route('/getCourse/<int:group_id>', methods=['GET'])
def get_course(group_id):
    data = db_worker.get_course(group_id)
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/addTopic', methods=['POST'])
def add_topic():
    data = request.get_json()
    g_id = data.get('g_id')
    s_id = data.get('s_id')
    t_name = data.get('t_name')
    db_worker.add_topic(g_id, s_id, t_name);
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/getMarksAll', methods=['GET'])
def get_marks_all():
    data = db_worker.get_marks_all()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/addMarks', methods=['POST'])
def add_marks():
    data = request.get_json()
    student_lis = data.get("send")
    db_worker.add_marks(student_lis)
    return jsonify({})

@app.route('/mark/patch', methods=['PATCH'])
def put_mark():
    data = request.get_json()
    update_marks_list = data.get('send')
    db_worker.put_mark(update_marks_list)
    return jsonify({})

if __name__== '__main__':
    DataBaseWorker.init_pool()
    app.run(debug=True, port=8000)