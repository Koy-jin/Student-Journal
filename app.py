from flask import Flask, request, jsonify
from flask_cors  import CORS
#from mysql.connector import errors
from pyexpat.errors import messages
from flasgger import Swagger
from db_worker import DataBaseWorker

app = Flask(__name__)
swagger = Swagger(app) 
CORS(app)
db_worker = DataBaseWorker()

@app.route('/login', methods=['POST'])
def login_user():
    """
    --- 
    tags:
        - Authentication
    summary: Аутентификация пользователя
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
                - username
                - password
            properties:
                username:
                    type: string
                    description: Логин пользователя 
                    example: admin
                password:
                    type: string
                    description: Пароль пользователя
                    example: "secret123"
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: Роль пользователя в системе (при успехе)
                        example: admin or teacher or student
                    message:
                        type: string
                        example: "Успешный вход" 
    """
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
    """
    --- 
    tags:
        - Authorization
    summary: Авторизация пользователя
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
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

"""
@app.route('/listJournal<int:group_id>', methods=['GET'])
def list_journal(group_id):
    journal_data = db_worker.get_user_data(group_id)
    return journal_data
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
"""

@app.route('/subject/add', methods=['POST'])
def add_subject():
    """
    --- 
    tags:
        - Subject
    summary: Добавление предмета
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = request.get_json()
    name = data.get('subjects')
    db_worker.add_subject((name,))
    return jsonify({    
        "success": True,
        "message": "success"
    }), 200

@app.route('/subject/get', methods=['GET'])
def get_subject():
    """
    --- 
    tags:
        - Subject
    summary: Забираем все предметы из бд 
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = db_worker.get_subjects_db()
    print(data, "ERROR")
    if data:
        return jsonify({
            "success": True,
            "message": "Success",
            "data": data
        }), 200
    print("ПУСТО")
    return jsonify({
        "success": False,
        "message": "false"
    }), 404

@app.route('/subject/delete', methods=['DELETE'])
def subjectDelete(): 
    """
    --- 
    tags:
        - Subject
    summary: Удаляем предмет 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h 
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = request.get_json()
    name = data.get("name")
    db_worker.delete_subject(name)   
    print("Удален ERRoR", data)
    return jsonify({})


@app.route('/user/add', methods=['POST'])
def add_user():
    """
    --- 
    tags:
        - User
    summary: Добавляем пользователя
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h 
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
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
        print("ERROR фываф")
        return jsonify({
            "success": "no",
            "message" : "Такой пользователь уже существует"
        })

@app.route('/user/getall', methods=['GET'])
def get_all_users():
    """
    --- 
    tags:
        - User
    summary: Берем всех пользователей
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
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
    """
    --- 
    tags:
        - User
    summary: Удаляем пользователя 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """    
    data = request.get_json()
    u_id = data.get("user")
    db_worker.userDelete(u_id);
    return jsonify({})

@app.route('/user/patchall', methods=['PATCH'])
def userPatchAll():
    """
    --- 
    tags:
        - User
    summary: Обновляем всех пользователей
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """  
    data = request.get_json()
    u_data = data.get('users')
    db_worker.patchUsersData(u_data)
    return jsonify({})

@app.route('/group/add', methods=['POST'])
def add_group():
    """
    --- 
    tags:
        - Group
    summary: Добавляем группу
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type:  p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example:    p_h
    """
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
    """
    --- 
    tags:
        - Group
    summary: Берем все группы
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
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

@app.route('/group/get/<int:group_id>', methods=['GET'])
def get_group(group_id):
    """
    --- 
    tags:
        - Group
    summary: Берем группу по её ID
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = db_worker.get_group(group_id)
    return jsonify({
        "success": True,
        "message": "success",
        "data": data
    })

@app.route('/group/delete', methods=['DELETE'])
def groupDelete():
    """
    --- 
    tags:
        - Group
    summary: удаляем группу
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """    
    data = request.get_json()
    g_id = data.get("group_id")
    print(g_id, "AAAAAAAA")
    db_worker.groupDelete(g_id)
    return jsonify({})



@app.route('/course/add', methods=['POST'])
def add_courses():
    """
    --- 
    tags:
        - Course
    summary: Это список предметов, которые назначенны группе. Тут он добаляется 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
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
    """
    --- 
    tags:
        - Course
    summary: Берет все курсы 
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example:  p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = db_worker.get_courses()
    print(data)
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/course/get/<int:group_id>', methods=['GET'])
def get_course(group_id):
    """
    --- 
    tags:
        - Course
    summary: Берет курс по ID группы 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h 
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = db_worker.get_course(group_id)
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })
@app.route('/course/subject/delete', methods=['DELETE'])
def deleteSubjectFromCourse():
    """
    --- 
    tags:
        - Course
    summary: Удаляет предмет из курса  
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = request.get_json()
    g_id = data.get("group_id")
    s_id = data.get("subject_id")
    db_worker.deleteSubjectFromCourse(g_id, s_id)
    return jsonify({})

@app.route('/topic/add', methods=['POST'])
def add_topic():
    """
    --- 
    tags:
        - Topic
    summary: Создает тему для предмета и группы 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
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
    """
    --- 
    tags:
        - Topic
    summary: берет все темы
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """
    data = db_worker.get_all_topics()
    print(data, "AAAAAA")
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })

@app.route('/topic/delete', methods=['DELETE'])
def topicDelete():
    """
    --- 
    tags:
        - Topic
    summary: Удаляет тему по ID группы и ID предмета 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """    
    data = request.get_json()
    g_id = data.get('group_id')
    s_id = data.get('subject_id')
    topic = data.get('topic')
    print(g_id, s_id, topic, "=+++===+++===++++AAAAAA===+++===+++")
    db_worker.deleteTopic(g_id, s_id, topic)
    return jsonify({})

@app.route('/mark/addall', methods=['POST'])
def add_marks():
    """
    --- 
    tags:
        - Mark
    summary: Добавляет оценку. Оценка принадлежит студенту и теме. 
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """ 
    data = request.get_json()
    student_lis = data.get("send")
    db_worker.add_marks(student_lis)
    return jsonify({})

@app.route('/mark/getall', methods=['GET'])
def get_marks_all():
    """
    --- 
    tags:
        - Mark
    summary: Берет все оценки 
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """  
    data = db_worker.get_marks_all()
    return jsonify({
        "success": True,
        "message": "Success",
        "data": data
    })


@app.route('/mark/patch', methods=['PATCH'])
def put_mark():
    """
    --- 
    tags:
        - Mark
    summary: Обновляет оценку
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            rquired: 
            properties:
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
                p_h:
                    type: p_h
                    description: p_h
                    example: p_h
    responses:
        200:
            description: Ответ сервера (успешный или не успешный)
            schema:
                type: object
                properties:
                    success:
                        type: boolean
                        example: true
                    status:
                        type: string
                        description: p_h
                        example: p_h
                    message:
                        type: p_h
                        example: p_h
    """ 
    data = request.get_json()
    update_marks_list = data.get('send')
    db_worker.put_mark(update_marks_list)
    return jsonify({})





if __name__== '__main__':
    DataBaseWorker.init_pool()
    app.run(debug=True, port=8000)