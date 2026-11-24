import os
from contextlib import contextmanager 
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor


class DataBaseWorker:
    _pool = None

    @classmethod
    def init_pool(cls):
        cls._pool = pool.ThreadedConnectionPool(
            minconn = 1,
            maxconn = 5,
            host = os.getenv("DB_HOST"),
            port = os.getenv("DB_PORT", 5432),
            user = os.getenv("DB_USER"),
            password = os.getenv("DB_PASSWORD"),
            dbname = os.getenv("DB_NAME"),
        )
    @classmethod
    @contextmanager
    def _get_conn(cls):
        if cls._pool is None:
            cls.init_pool()
        conn = cls._pool.getconn()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cls._pool.putconn(conn)


    @classmethod
    def authorization(cls, login):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                insert_query = """
                INSERT INTO users (name, password, role, group_id, login)
                VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (name, password, role, group_id, login,))
                return True
            
    @classmethod
    def add_studentCheckLogin(cls, login):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                select_query = """
                SELECT login FROM users
                WHERE login=%s
                """
                cursor.execute(select_query, (login,))
                student = cursor.fetchone()
                if student:
                    return False
                return True
            
    @classmethod
    def  add_subject(cls, subject):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:

                insert_query = """
                INSERT INTO subjects (name)
                VALUES (%s)
                """
                cursor.execute(insert_query, (subject,))
                return f"Success: {subject} Добавлен"
            
    @classmethod
    def add_group(cls, group):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:

                insert_query = """
                INSERT INTO student_groups (name)
                VALUES (%s)
                """
                cursor.execute(insert_query, (group,))
                return True
            
    @classmethod
    def add_topic(cls, g_id, s_id, t_name):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:

                insert_query = """
                INSERT INTO topics (subject_id, name, group_id)
                VALUES (%s, %s, %s)
                """
                cursor.execute(insert_query, (s_id, t_name, g_id))
                return True
            
    @classmethod
    def add_mark(cls, student_id, topic_id, mark):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:

                insert_query = """ 
                INSERT INTO marks (student_id, topic_id, mark)
                VALUES (%s, %s, %s) 
                """
                cursor.execute(insert_query,(student_id, topic_id, mark))
                return
            
    @classmethod
    def get_student(cls, role):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                select_query = """
                SELECT id, name, group_id
                FROM users 
                WHERE users.role = %s
                """
                cursor.execute(select_query, (role,))
                students = cursor.fetchall()
                if students:
                    return students
                return False
            
    @classmethod
    def get_subjects_db(cls):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:

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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                insert_query = """
                INSERT INTO courses (group_id, subject_id)
                VALUES (%s, %s)
                """
                cursor.execute(insert_query,(group_id, subject_id))
            return True
    @classmethod
    def get_courses(cls):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
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
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                select_query = """
                    SELECT * FROM topics
                    """
                cursor.execute(select_query)
                data = cursor.fetchall()
                return data
    
    @classmethod
    def get_marks_all(cls):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                select_query = """
                SELECT * FROM marks
                """
                cursor.execute(select_query)
                data = cursor.fetchall()
                return data

    @classmethod
    def add_marks(cls, student_list):
        records_to_insert  = [(int(item['student_id']), str(item['grade']), int(item['subject_id']),str(item['topic']), int(item['group_id'])) for item in student_list]
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                try:
                    insert_query = """
                    INSERT INTO marks (student_id, grade, sub_id, t_name, grp_id)
                    VALUES (%s, %s, %s, %s, %s)
                    """
                    cursor.executemany(insert_query, records_to_insert)
                    return True
                except psycopg2.Error as err:
                    connection.rollback()
                    return False
    
    @classmethod
    def put_mark(cls, update_marks_list):
        records_to_update = [(item['mark'], int(item['student_id']), int(item['sub_id']), item['t_name'], int(item['grp_id'])) for item in update_marks_list]
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                put_query = """
                UPDATE marks
                SET grade = %s
                WHERE student_id = %s AND sub_id = %s AND t_name = %s AND grp_id = %s
                """
                cursor.executemany(put_query, records_to_update)
        return

    @classmethod
    def delete_subject(cls, data):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                delete_query = """
                DELETE FROM subjects WHERE name=%s
                """ 
                cursor.execute(delete_query, (data,))
        return

    @classmethod
    def deleteSubjectFromCourse(cls, g_id, s_id):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                delete_query = """
                DELETE FROM courses WHERE group_id = %s AND subject_id = %s
                """
                cursor.execute(delete_query,(g_id, s_id, ))
        return

    @classmethod
    def groupDelete(cls, g_id):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                delete_query = """
                DELETE FROM student_groups WHERE id=%s
                """
                cursor.execute(delete_query, (g_id,))
        return
    
    @classmethod
    def userDelete(cls, u_id):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                delet_query = """
                DELETE FROM users WHERE id=%s
                """
                cursor.execute(delet_query, (u_id,))
        return
    
    @classmethod
    def patchUsersData(cls, u_data):
        records_to_update = [(item["group_id"], item["role"], item["id"]) for item in u_data]
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                putch_query = """
                UPDATE users
                SET group_id = %s, role = %s 
                WHERE id = %s 
                """
                cursor.executemany(putch_query, records_to_update)
        return
    @classmethod
    def deleteTopic(cls, g_id, s_id, topic):
        with cls._get_conn() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                delete_query = """
                DELETE FROM topics WHERE group_id=%s AND subject_id=%s AND name=%s
                """
                cursor.execute(delete_query, (g_id, s_id, topic))
        return
