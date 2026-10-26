from flask import Flask, request, jsonify
from flask_cors  import CORS
from mysql.connector import errors
from pyexpat.errors import messages
from flasgger import Swagger
from db_worker import DataBaseWorker

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "openapi": "3.0.3"
}

app = Flask(__name__)
CORS(app)
db_worker = DataBaseWorker()
swagger = Swagger(app, template_file='swagger_docks/swagger.yaml', config=swagger_config)

@app.route('/login', methods=['POST'])
def login_user():
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

@app.route('/subject/add', methods=['POST'])
def add_subject():
    data = request.get_json()
    name = data.get('subjects')
    db_worker.add_subject((name,))
    return jsonify({    
        "success": True,
        "message": "success"
    }), 200

@app.route('/subject/get', methods=['GET'])
def get_subject():
    data = db_worker.get_subjects_db()
    if data:
        return jsonify({
            "success": True,
            "message": "Success",
            "data": data
        }), 200
    return jsonify({
        "success": False,
        "message": "false"
    }), 404

@app.route('/subject/delete', methods=['DELETE'])
def subjectDelete():
    data = request.get_json()
    name = data.get("name")
    db_worker.delete_subject(name)   
    return jsonify({})


@app.route('/user/add', methods=['POST'])
def add_user():
    data = request.get_json()
    login = data.get('logins')
    password = data.get('passwords')
    name = data.get('names')
    role = data.get('rols')
    group = data.get('groups')
    if group == 0:
        group = None

    if db_worker.add_studentCheckLogin(login):
        db_worker.add_student(name, password, role, group, login)
        return jsonify({
            "success": "ok",
            "message": "Пользователь добавлен"
        })
    else:
        return jsonify({
            "success": "no",
            "message" : "Такой пользователь уже существует"
        })

@app.route('/user/getall', methods=['GET'])
def get_all_users():
    user_data = db_worker.get_all_user_data()
    if user_data: 
        return jsonify({
            "success": True,
            "message": "Success",
            "data": user_data
        })
    return jsonify({
            "success": False,
            "message": "Success",
            "data": user_data
        })

@app.route('/user/delete', methods=['DELETE'])
def userDelete():
    data = request.get_json()
    u_id = data.get("user")
    db_worker.userDelete(u_id);
    return jsonify({})

@app.route('/user/patchall', methods=['PATCH'])
def userPatchAll():
    data = request.get_json()
    u_data = data.get('users')
    db_worker.patchUsersData(u_data)
    return jsonify({})

@app.route('/group/add', methods=['POST'])
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

@app.route('/group/getall', methods=['GET'])
def get_all_group():
    groups_list = db_worker.get_all_groups()
    if groups_list:
        return jsonify({
            "success": True,
            "message": "Успешно",
            "groups": groups_list})
    return jsonify({
        "success": False,
        "message": "Данных ещё нет"
    })

@app.route('/group/get/<int:group_id>', methods=['GET'])
def get_group(group_id):
    data = db_worker.get_group(group_id)
    return jsonify({
        "success": True,
        "message": "success",
        "data": data
    })

@app.route('/group/delete', methods=['DELETE'])
def groupDelete():
    data = request.get_json()
    g_id = data.get("group_id")
    db_worker.groupDelete(g_id)
    return jsonify({})



@app.route('/course/add', methods=['POST'])
def add_courses():
    data = request.get_json()
    group_id = data.get("group")
    subject_id = data.get("subject")
    db_worker.add_course(group_id, subject_id )
    return jsonify({
        "success" : True,
        "message": "Success"
    })

@app.route('/course/getall', methods=['GET'])
def get_courses():
    data = db_worker.get_courses()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/course/get/<int:group_id>', methods=['GET'])
def get_course(group_id):
    data = db_worker.get_course(group_id)
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })
@app.route('/course/subject/delete', methods=['DELETE'])
def deleteSubjectFromCourse():
    data = request.get_json()
    g_id = data.get("group_id")
    s_id = data.get("subject_id")
    db_worker.deleteSubjectFromCourse(g_id, s_id)
    return jsonify({})

@app.route('/topic/add', methods=['POST'])
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

@app.route('/topic/getall', methods=['GET'])
def get_all_topics():
    data = db_worker.get_all_topics()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/topic/delete', methods=['DELETE'])
def topicDelete():
    data = request.get_json()
    g_id = data.get('group_id')
    s_id = data.get('subject_id')
    topic = data.get('topic')
    db_worker.deleteTopic(g_id, s_id, topic)
    return jsonify({})

@app.route('/mark/addall', methods=['POST'])
def add_marks():
    data = request.get_json()
    student_lis = data.get("send")
    db_worker.add_marks(student_lis)
    return jsonify({})

@app.route('/mark/getall', methods=['GET'])
def get_marks_all():
    data = db_worker.get_marks_all()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })


@app.route('/mark/patch', methods=['PATCH'])
def put_mark():
    data = request.get_json()
    update_marks_list = data.get('send')
    db_worker.put_mark(update_marks_list)
    return jsonify({})





if __name__== '__main__':
    DataBaseWorker.init_pool()
    app.run(debug=True, port=8000)

    ### dasdfasdf