select id as 'DEPARTMENT ID', names as 'DEPARTMENT NAME' from department;

select r.id as 'ROLE ID', r.title as 'JOB TITLE', d.names as 'DEPARTMENT NAME', r.salary 'SALARY'
from roles r
LEFT JOIN department d on d.id = r.department_id;

SELECT e.id AS 'EMPLOYEE ID', Concat(e.first_name, ' ', e.last_name) AS 'EMPLOYEE NAME', 
r.title AS 'DEPARTMENT TITLE', d.names AS 'DEPARTMENT NAME', r.salary AS 'SALARY', 
CONCAT(m.first_name, ' ', m.last_name) AS 'MANAGER NAME'
FROM employee e 
LEFT JOIN roles r on e.role_id = r.id 
LEFT JOIN department d on r.department_id = d.id 
LEFT JOIN employee m on m.id = e.manager_id;

SELECT e.id AS 'EMPLOYEE ID', Concat(e.first_name, ' ', e.last_name) AS 'fullname'
FROM employee e
LEFT JOIN roles r on e.role_id = r.id
LEFT JOIN department d on r.department_id = d.id
WHERE r.is_manager = 1
AND d.id in (select department_id from roles where id = 2);

update employee e, roles r set e.manager_id = e.id 
where r.id = e.role_id 
and r.is_manager = 1 
and r.id not in (select id from roles where is_manager = 1);

update employee e, roles r, department d set e.manager_id = e.id 
where d.id = 5
and r.id in (select id from roles where is_manager = 1);

insert into department(names) valaue(?), department_name;
insert into roles(title, salary, department_id) values("?", ?, ?), department_title, salary, department_id;
insert into employee(first_name, last_name, role_id, manager_id) values('first_name', 'last_name', role_id , manager_id);

update employee set role_id = (?), role_id;



update employee e 
LEFT JOIN roles r on e.role_id = r.id 
LEFT JOIN department d on r.department_id = d.id 
LEFT JOIN employee m on m.id = e.manager_id
LEFT JOIN role a on a.id = m.manager_id
AND m.role_id = r.id
set  m.manager_id = e.id
where d.id = 5
and r.id in (select id from roles where is_manager = 1);

SELECT e.id AS 'EMPLOYEE ID', Concat(e.first_name, ' ', e.last_name) AS 'EMPLOYEE NAME', 
r.title AS 'DEPARTMENT TITLE', d.names AS 'DEPARTMENT NAME', r.salary AS 'SALARY', 
CONCAT(m.first_name, ' ', m.last_name) AS 'MANAGER NAME'
FROM employee e 
LEFT JOIN roles r on e.role_id = r.id 
LEFT JOIN department d on r.department_id = d.id 
LEFT JOIN employee m on m.id = e.manager_id
LEFT JOIN roles a on a.id = m.manager_id
AND e.id = 5;
