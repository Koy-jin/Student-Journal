CREATE TABLE IF NOT EXISTS student_groups(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin', 'teacher')),
    group_id INTEGER REFERENCES student_groups(id) ON DELETE CASCADE,
    login VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE (group_id, subject_id)
);

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    group_id INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE,
    UNIQUE (group_id, subject_id, name)
);

CREATE TABLE IF NOT EXISTS marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    grade TEXT NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    sub_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    t_name TEXT NOT NULL,
    grp_id INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE
);