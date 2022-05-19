insert into department(names) values('Human Resources');
insert into roles(title, salary, department_id) values("Hr Manager", 85000.00, 1);
insert into employee(first_name, last_name, role_id) values('Julie', 'Ellis', 1);
insert into roles(title, salary, department_id) values("Hr Consultant", 45000.00, 1);
insert into employee(first_name, last_name, role_id, manager_id) values('Julie', 'Ellis', 2 , 1);