import mysql.connector
from click import group
from mysql.connector import pooling
from mysql.connector.aio import connect
from sqlalchemy import true
from sqlalchemy.dialects.oracle.dictionary import dictionary_meta
from sqlalchemy.engine import connection_memoize


class DataBaseWorker:
    _pool = None

    @classmethod
    def init_pool(cls):
        db_config = {
            "host": '127.0.0.1',
            "user": 'dbworker',
            "password": 'Maria2001',
            "database": 'journaldb'
        }
        cls._pool = pooling.MySQLConnectionPool(
            pool_name="flask_pool",
            pool_size=5,
            **db_config
        )
    @classmethod
    def _get_conn(cls):
        if cls._pool is None:
            cls.init_pool()
        return cls._pool.get_connection()

    @classmethod
    def authorization(cls, login):
        connection  = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                SELECT *
                FROM users
                WHERE login =%s
                """
                cursor.execute(select_query, (login,))
                user = cursor.fetchone()
                if user:
                    return user
                return False
    @classmethod
    def add_student(cls, name, password, role, group_id, login ):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                insert_query = """
                INSERT INTO users (name, password, role, group_id, login)
                VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (name, password, role, group_id, login,))
                connection.commit()

                return True
    @classmethod
    def add_studentCheckLogin(cls, login):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                select_query = """
                SELECT name FROM users
                WHERE name=%s
                """
                cursor.execute(select_query, (login,))
                student = cursor.fetchone()
                if student:
                    return False
                return True
    @classmethod
    def  add_subject(cls, subject):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                insert_query = """
                INSERT INTO subjects (name)
                VALUES (%s)
                """
                cursor.execute(insert_query, subject)
                connection.commit()
                return f"Success: {subject} Добавлен"
    @classmethod
    def add_group(cls, group):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                insert_query = """
                INSERT INTO student_groups (name)
                VALUES (%s)
                """
                cursor.execute(insert_query, (group,))
                connection.commit()
                return True
    @classmethod
    def add_topic(cls, g_id, s_id, t_name):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                insert_query = """
                INSERT INTO topics (subject_id, name, group_id)
                VALUES (%s, %s, %s)
                """
                cursor.execute(insert_query, (s_id, t_name, g_id))
                connection.commit()
                return True
    @classmethod
    def add_mark(cls, student_id, topic_id, mark):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                insert_query = """ 
                INSERT INTO marks (student_id, topic_id, mark)
                VALUES (%s, %s, %s,) 
                """
                cursor.execute(insert_query,(student_id, topic_id, mark))
                connection.commit()
                return
    @classmethod
    def get_student(cls, role):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                select_query = """
                SELECT id, name, group_id
                FROM users 
                WHERE users.role = %s
                """
                cursor.execute(select_query, role)
                students = cursor.fetchone()
                if students:
                    return students
                return False
    @classmethod
    def get_subjects_db(cls):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                if cursor.with_rows:
                    cursor.fetchall()
                select_query = """
                SELECT * 
                FROM subjects
                """
                cursor.execute(select_query)
                subjects_data = cursor.fetchall()
                if subjects_data:
                    return subjects_data
                return None
    @classmethod
    def get_all_groups(cls):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:

                select_query = """ 
                SELECT *
                FROM student_groups
                """
                cursor.execute(select_query)
                group_data = cursor.fetchall()
                if group_data:
                   return  group_data
                return None
    @classmethod
    def get_all_user_data(cls):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                SELECT 
                u.id AS id,
                u.name AS user,
                u.role AS role, 
                sg.id AS groups_id, 
                sg.name AS group_name
                FROM users u
                LEFT JOIN student_groups sg ON u.group_id = sg.id
                """
                cursor.execute(select_query)
                users_data = cursor.fetchall()
                return users_data
    @classmethod
    def get_group(cls, group_id):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                SELECT name, id 
                FROM users
                WHERE group_id = %s
                """
                cursor.execute(select_query, (group_id,))
                data = cursor.fetchall()
                return data
    @classmethod
    def add_course(cls, group_id, subject_id):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                insert_query = """
                INSERT INTO courses (group_id, subject_id)
                VALUES (%s, %s)
                """
                cursor.execute(insert_query,(group_id, subject_id))
                connection.commit()
            return True
    @classmethod
    def get_courses(cls):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                SELECT
                s.name AS subject_name,
                s.id AS subject_id,
                g.name AS s_groups_name,
                g.id AS s_groups_id
                FROM 
                    courses AS c
                JOIN
                    subjects AS s ON c.subject_id = s.id
                JOIN
                    student_groups AS g ON c.group_id = g.id 
                """
                cursor.execute(select_query)
                data = cursor.fetchall()
                return data
    @classmethod
    def get_course(cls, group_id ):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                        SELECT
                        c.group_id AS id,
                        c.subject_id AS subject_id,
                        s.name AS name
                        FROM courses c
                        JOIN subjects s ON c.subject_id = s.id  
                        WHERE c.group_id = %s
                        """
                cursor.execute(select_query, (group_id,))
                data = cursor.fetchall()
                return data
    @classmethod
    def get_all_topics(cls):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                    SELECT * FROM topics
                    """
                cursor.execute(select_query)
                data = cursor.fetchall()
                return data
        pass
    
    @classmethod
    def get_marks_all(cls):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                select_query = """
                SELECT * FROM marks
                """
                cursor.execute(select_query)
                data = cursor.fetchall()
                return data

    @classmethod
    def add_marks(cls, student_list):
        records_to_insert  = [(int(item['student_id']), str(item['grade']), int(item['subject_id']),str(item['topic']), int(item['group_id'])) for item in student_list]
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=True) as cursor:
                try:
                    insert_query = """
                    INSERT INTO marks (student_id, grade, sub_id, t_name, grp_id)
                    VALUES (%s, %s, %s, %s, %s)
                    """
                    cursor.executemany(insert_query, records_to_insert)
                    connection.commit()
                    return True
                except mysql.connector.Error as err:
                    connection.rollback()
                    return False
    
    @classmethod
    def put_mark(cls, update_marks_list):
        records_to_update = [(item['mark'], int(item['student_id']), int(item['sub_id']), item['t_name'], int(item['grp_id'])) for item in update_marks_list]
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=True) as cursor:
                put_query = """
                UPDATE marks
                SET grade = %s
                WHERE student_id = %s AND sub_id = %s AND t_name = %s AND grp_id = %s
                """
                cursor.executemany(put_query, records_to_update)
                connection.commit()
        return

    @classmethod
    def delete_subject(cls, data):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=True) as cursor:
                delete_query = """
                DELETE FROM subjects WHERE name=%s
                """ 
                cursor.execute(delete_query, (data,))
                connection.commit()
        return

    @classmethod
    def deleteSubjectFromCourse(cls, g_id, s_id):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=True) as cursor:
                delete_query = """
                DELETE FROM courses WHERE group_id = %s AND subject_id = %s
                """
                cursor.execute(delete_query,(g_id, s_id, ))
                connection.commit()
        return

    @classmethod
    def groupDelete(cls, g_id):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=True) as cursor:
                delete_query = """
                DELETE FROM student_groups WHERE id=%s
                """
                cursor.execute(delete_query, (g_id,))
                connection.commit()
        return
    
    @classmethod
    def userDelete(cls, u_id):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=true) as cursor:
                delet_query = """
                DELETE FROM users WHERE id=%s
                """
                cursor.execute(delet_query, (u_id,))
                connection.commit()
        return
    
    @classmethod
    def patchUsersData(cls, u_data):
        records_to_update = [(item["group_id"], item["role"], item["id"]) for item in u_data]
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=true) as cursor:
                putch_query = """
                UPDATE users
                SET group_id = %s, role = %s 
                WHERE id = %s 
                """
                cursor.executemany(putch_query, records_to_update)
                connection.commit()
        return
    @classmethod
    def deleteTopic(cls, g_id, s_id, topic):
        connection = cls._get_conn()
        with connection:
            with connection.cursor(buffered=True) as cursor:
                delete_query = """
                DELETE FROM topics WHERE group_id=%s AND subject_id=%s AND name=%s
                """
                cursor.execute(delete_query, (g_id, s_id, topic))
                connection.commit()
        return
