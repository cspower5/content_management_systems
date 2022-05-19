use cms;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS department;

create table department(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    names varchar(30) NOT NULL
    );

    create table roles(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(30) NOT NULL,
    salary decimal(10,2),
    department_id INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
    );

create table employee(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    CONSTRAINT fk_roles FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id)
    );

    

