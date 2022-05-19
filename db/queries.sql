select id as 'DEPARTMENT ID', names as 'DEPARTMENT NAME' from department;

select r.id as 'ROLE ID', r.title as 'JOB TITLE', d.names as 'DEPARTMENT NAME', r.salary 'SALARY'
from roles r, department d
where d.id = r.department_id;

select e.id as 'EMPLOYEE ID', concat(e.first_name, ' ', e.last_name) as 'EMPLOYEE NAME', 
r.title as 'JOB TITLE', d.names as 'DEPARTMENT NAME', r.salary as 'SALARY', 
(
CASE
WHEN ISNULL(e.manager_id) 
    then 'N/A'
WHEN concat(e.first_name, ' ', e.last_name) = (select concat(first_name, ' ', last_name) from employee where id = manager_id)
    then concat(e.first_name, ' ', e.last_name)
END 
) as 'MANAGER NAME' 
from department d, roles r, employee e
Where e.role_id = r.id
and r.department_id = d.id;
