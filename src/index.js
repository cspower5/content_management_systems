const inquirer = require("inquirer");
const dbconnect = require("../db/db_connect.js")



function init() {
	mainMenu();
}

async function mainMenu(){
  	const response = await inquirer.prompt({
    	name: "action",
      	message: "what would you like to do?",
      	type: "list",
      	choices: ["See Departments", "See Roles", "See Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Exit"]
    });
     	switch (response.action){
        case "See Departments": return showDept();
        case "See Roles": return showRoles();
        case "See Employees": return showEmployees();
        case "Add Department": return addDept();
        case "Add Role": return addRole();
        case "Add Employee": return addEmp();
        case "Update Employee Role": return updateEmpRole();
        default: return end();
    }
}
//Function that returns all the current departments
async function showDept(){
    const sql = `select id as 'DEPARTMENT ID', names as 'DEPARTMENT NAME' from department`;
      dbconnect.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        mainMenu();
    });
  	
}
//Function that returns all the current roles
async function showRoles(){
    const sql = `select r.id as 'ROLE ID', r.title as 'JOB TITLE', d.names as 'DEPARTMENT NAME', r.salary 'SALARY'
                 from roles r
                 LEFT JOIN department d on d.id = r.department_id;`;
      dbconnect.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        mainMenu();
    });
    
}
//Function that returns all the current employees
async function showEmployees(){
    const sql = `SELECT e.id AS 'EMPLOYEE ID', Concat(e.first_name, ' ', e.last_name) AS 'EMPLOYEE NAME', 
                 r.title AS 'DEPARTMENT TITLE', d.names AS 'DEPARTMENT NAME', r.salary AS 'SALARY', 
                 CONCAT(m.first_name, ' ', m.last_name) AS 'MANAGER NAME'
                 FROM employee e 
                 LEFT JOIN roles r on e.role_id = r.id 
                 LEFT JOIN department d on r.department_id = d.id 
                 LEFT JOIN employee m on m.id = e.manager_id;`;
      dbconnect.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        mainMenu();
    });
}

async function addDept(){
    //show the list of current departments
    const sql = `select id as 'DEPARTMENT ID', names as 'DEPARTMENT NAME' from department`;
    dbconnect.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
  
        // Request name  of new department
        inquirer.prompt([ {
            type:"input",
            name:"department",
            message:"Enter Your Department Name: "
            }])
        .then(answers => {
            //Add New Department to cms database
            const newDept = (answers.department)
            const sql_roles = `insert into department(names) value("${newDept}");`
            dbconnect.query(sql_roles, newDept, (err) => {
                if(err) throw err;
                console.log("New Department has been added.");          
            })
        })
    })
    mainMenu();
}

async function addRole(){
    //show the list of current departments and captures departments id and name
    const sql_departments = `select id, names from department`;
    dbconnect.query(sql_departments, (err, rows) => {
        if(err) throw err;
        departments = Object.keys(rows).map((key) => [id(key), rows[key]]);
        console.log(departments);
        inquirer.prompt([
            {
                type:"list",
                name:"department",
                message:"Choose the depart for the new job Title",
                choices:[departments]

            },
            {
                type:"input",
                name:"role",
                message:"Enter Your Job Title"
            },
            {
                type:"input",
                name:"salary",
                message:"Enter the Salary for the Job Title."
            }
        ])
        .then(answers => {
            const newRole = [answers.role, answers.salary, answers.departments]
            console.log(newRole);
            const sql_insert = `insert into roles(title, salary, department_id) values()`;
            dbconnect.query(sql_insert, newRole, (err, rows) => {
                if(err) throw err;
                console.log("New Role has been added.");          
            })
            mainMenu();
        })
        
    })
         
}

async function addEmp(){
    mainMenu();
}

async function updateEmpRole() {
    mainMenu();
}

function end(){
    console.log("You have exited from the app");
    console.log("Thank You");
    return;
    
}

init();