--departments
insert into department(names) values('Human Resources');
insert into department(names) values('Tech Ops');
insert into department(names) values('Sales Team');
insert into department(names) values('Customer Service');
insert into department(names) values('Executive Level');

--Roles
insert into roles(title, salary, department_id) values("Hr Manager", 85000.00, 1);
insert into roles(title, salary, department_id) values("Hr Consultant", 45000.00, 1);
insert into roles(title, salary, department_id) values("Tech OPs Manager", 185000.00, 2);
insert into roles(title, salary, department_id) values("Tech OPs Engineer", 95000.00, 2);


--Employees
insert into employee(first_name, last_name, role_id) values('Julie', 'Ellis', 1);
insert into employee(first_name, last_name, role_id, manager_id) values('Sadie', 'Hunter', 2 , 1);
insert into employee(first_name, last_name, role_id) values('Christopher', 'Borer', 3);
insert into employee(first_name, last_name, role_id, manager_id) values('Patrick', 'Johnson', 4 , 3);