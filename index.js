const inquirer = require("inquirer");
const dbconnect = require("./db/db_connect.js");
var psuedo_emp = 0;
var psuedo_role = 0;

function init() {
  mainMenu();
}

async function mainMenu() {
  const response = await inquirer.prompt({
    name: "action",
    message: "what would you like to do?",
    type: "list",
    choices: [
      "See Departments",
      "See Roles",
      "See Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "Exit",
    ],
  });
  switch (response.action) {
    case "See Departments":
      return showDept();
    case "See Roles":
      return showRoles();
    case "See Employees":
      return showEmployees();
    case "Add Department":
      return addDept();
    case "Add Role":
      return addRole();
    case "Add Employee":
      return addEmp();
    case "Update Employee Role":
      return updateEmpRole();
    case "Update Employee Manager":
      return updateEmpManager(psuedo_emp, psuedo_role);
    default:
      return end();
  }
}
//Function that returns all the current departments
async function showDept() {
  const sql = `select id as 'DEPARTMENT ID', names as 'DEPARTMENT NAME' from department`;
  dbconnect.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    mainMenu();
  });
}
//Function that returns all the current roles
async function showRoles() {
  const sql = `select r.id as 'ROLE ID', r.title as 'JOB TITLE', d.names as 'DEPARTMENT NAME', r.salary 'SALARY'
                 from roles r
                 LEFT JOIN department d on d.id = r.department_id;`;
  dbconnect.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    mainMenu();
  });
}
//Function that returns all the current employees
async function showEmployees() {
  const sql = `SELECT e.id AS 'EMPLOYEE ID', Concat(e.first_name, ' ', e.last_name) AS 'EMPLOYEE NAME', 
                 r.title AS 'DEPARTMENT TITLE', d.names AS 'DEPARTMENT NAME', r.salary AS 'SALARY', 
                 COALESCE(CONCAT(m.first_name, ' ', m.last_name),'NO MANAGER') AS 'MANAGER NAME'
                 FROM employee e 
                 LEFT JOIN roles r on e.role_id = r.id 
                 LEFT JOIN department d on r.department_id = d.id 
                 LEFT JOIN employee m on m.id = e.manager_id;`;
  dbconnect.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    mainMenu();
  });
}

async function addDept() {
  //show the list of current departments
  const sql = `select id as 'DEPARTMENT ID', names as 'DEPARTMENT NAME' from department`;
  dbconnect.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);

    // Request name  of new department
    inquirer
      .prompt([
        {
          type: "input",
          name: "department",
          message: "Enter Your Department Name: ",
        },
      ])
      .then((answers) => {
        //Add New Department to cms database
        const newDept = answers.department;
        const sql_roles = `insert into department(names) value("${newDept}");`;
        dbconnect.query(sql_roles, newDept, (err) => {
          if (err) throw err;
          console.log("New Department has been added.");
        });
      });
  });
  mainMenu();
}

async function addRole() {
  //show the list of current departments and captures departments id and name
  const sql_departments = `select id, names from department order by names;`;
  dbconnect.query(sql_departments, (err, rows) => {
    if (err) throw err;
    const department = rows.map((row) => {
      return { value: row.id, name: row.names };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Choose the depart for the new job Title",
          choices: department,
        },
        {
          type: "input",
          name: "role",
          message: "Enter Your Job Title",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the Salary for the Job Title.",
        },
      {
        type: "confirm",
        name: "is_manager",
        message: "is this role a manager position",
        default: 'false',
      },
      ])
      .then((answers) => {
        if(answers.is_manager) {
          var is_manager = 1;
        } else {
          var is_manager = 0;
        }
        const newRole = [answers.role, answers.salary, answers.department];
        const sql_insert = `insert into roles(title, salary, department_id, is_manager) 
                            values("${newRole[0]}", ${newRole[1]}, ${newRole[2]}, ${is_manager})`;
        dbconnect.query(sql_insert, newRole, (err) => {
          if (err) throw err;
          console.log("New Role has been added.");
        });
        mainMenu();
      });
  });
}

async function addEmp() {
  //show the list of current departments and captures departments id and name
  const sql_roles = `select id, title from roles`;
  dbconnect.query(sql_roles, (err, rows) => {
    if (err) throw err;
    const roles = rows.map((row) => {
      return { value: row.id, name: row.title };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Choose the role for the new employee",
          choices: roles,
        },
        {
          type: "input",
          name: "fName",
          message: "Enter The Employee First Name",
        },
        {
          type: "input",
          name: "lName",
          message: "Enter The Employee Last Name",
        },
        {
          type: "input",
          name: "manager",
          message: "Enter the Managers ID If Required",
        },
      ])
      .then((answers) => {
        const newEmp = [
          answers.role,
          answers.fName,
          answers.lName,
          answers.manager,
        ];
        if (answers.manager) {
          var sql_insert = `insert into employee(first_name, last_name, role_id, manager_id) 
                               values("${newEmp[1]}", "${newEmp[2]}", ${newEmp[0]}, ${newEmp[3]})`;
        } else {
          var sql_insert = `insert into employee(first_name, last_name, role_id)
                            values("${newEmp[1]}", "${newEmp[2]}", ${newEmp[0]})`;
        }
        dbconnect.query(sql_insert, newEmp, (err, res) => {
          if (err) throw err;
          console.log("New Employee has been added.");
          mainMenu();
        });
      });
  });
}

async function updateEmpRole() {
  const sql_emp = `select id, concat(first_name, ' ', last_name) as full_name from employee;`;
  dbconnect.query(sql_emp, (err, rows) => {
    if (err) throw err;
    const employee = rows.map((row) => {
      return { value: row.id, name: row.full_name };
    });
    const sql_roles = `select id, title, department_id from roles;`;
    dbconnect.query(sql_roles, (err, rows) => {
      if (err) throw err;
      const roles = rows.map((row) => {
        return { value: row.id, name: row.title };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Choose the Employee to be updated",
            choices: employee,
          },
          {
            type: "list",
            name: "role",
            message: "Choose the new role",
            choices: roles,
          },
        ])
        .then((answers) => {
          const upEmp = [answers.employee, answers.role];
          const sql_update = `update employee set role_id = ${upEmp[1]} where id = ${upEmp[0]};`;
          dbconnect.query(sql_update, (err) => {
            if (err) throw err;
            updateEmpManager(upEmp[0], upEmp[1] );
          });
          console.log("Employee Role has been Updated.");
        });
      
    });
  });
}

async function updateEmpManager(empId, empRole) {
  var no_manager = { value: 0, name: "No Manager Available" };
  if (!empId) {
    var sql_emp = `select id, concat(first_name, ' ', last_name) as full_name from employee;`;

    var sql_managers = `SELECT e.id, Concat(e.first_name, ' ', e.last_name) AS 'full_name'
                      FROM employee e
                      LEFT JOIN roles r on e.role_id = r.id
                      WHERE r.is_manager = 1;`;
  } else {
    var sql_emp = `select id, concat(first_name, ' ', last_name) as full_name from employee where id = ${empId};`;

    var sql_managers = `SELECT e.id, Concat(e.first_name, ' ', e.last_name) AS 'full_name'
                          FROM employee e
                          LEFT JOIN roles r on e.role_id = r.id
                          LEFT JOIN department d on r.department_id = d.id
                          WHERE r.is_manager = 1
                          AND d.id in (select department_id from roles where id = ${empRole});`;
  }
  dbconnect.query(sql_emp, (err, rows) => {
    if (err) throw err;
    const employee = rows.map((row) => {
      return { value: row.id, name: row.full_name };
    });
    dbconnect.query(sql_managers, (err, rows) => {
      if (err) throw err;
      let managers = rows.map((row) => {
        return { value: row.id, name: row.full_name };
      });
      managers.unshift(no_manager);
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Choose the Employee to be updated",
            choices: employee,
          },
          {
            type: "list",
            name: "manager",
            message: "Choose the new manager",
            choices: managers,
            default: "manager",
          },
        ])
        .then((answers) => {
          const upMan = [answers.employee, answers.manager];
          if (upMan[1] !== 0) {
            var sql_update = `update employee set manager_id = ${upMan[1]} where id = ${upMan[0]};`;
          } else {
            var sql_update = `update employee set manager_id = NULL where id = ${upMan[0]};`;
          }
          dbconnect.query(sql_update, (err) => {
            if (err) throw err;
          });
          console.log("Employee Manger has been Updated.");
          mainMenu();
        });
    });
  });
}

function end() {
  console.log("You have exited from the app");
  console.log("Thank You");
  process.exit();
}

init();
