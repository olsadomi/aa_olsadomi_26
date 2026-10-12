// Organizational Hierarchy Analysis
// Every hierarchy traversal in this file is recursive, as required.

const employees = [
    { id: 1, name: "Alice Johnson", position: "CEO", salary: 250000, supervisor_id: null },
    { id: 2, name: "Bob Smith", position: "CTO", salary: 180000, supervisor_id: 1 },
    { id: 3, name: "Carol White", position: "CFO", salary: 175000, supervisor_id: 1 },
    { id: 4, name: "David Brown", position: "Engineering Manager", salary: 140000, supervisor_id: 2 },
    { id: 5, name: "Eve Davis", position: "QA Manager", salary: 130000, supervisor_id: 2 },
    { id: 6, name: "Frank Wilson", position: "Senior Accountant", salary: 95000, supervisor_id: 3 },
    { id: 7, name: "Grace Lee", position: "Senior Developer", salary: 120000, supervisor_id: 4 },
    { id: 8, name: "Henry Martinez", position: "Junior Developer", salary: 85000, supervisor_id: 4 },
    { id: 9, name: "Ivy Chen", position: "QA Engineer", salary: 90000, supervisor_id: 5 },
    { id: 10, name: "Jack Thompson", position: "DevOps Engineer", salary: 110000, supervisor_id: 4 },
    { id: 11, name: "Kelly Anderson", position: "Junior Accountant", salary: 65000, supervisor_id: 6 },
    { id: 12, name: "Liam Garcia", position: "Intern Developer", salary: 50000, supervisor_id: 7 }
];

function buildEmployeeMap(employeeList) {
    const employeeById = new Map();

    for (const employee of employeeList) {
        employeeById.set(employee.id, employee);
    }

    return employeeById;
}

function buildChildrenIndex(employeeList) {
    const childrenBySupervisor = new Map();

    for (const employee of employeeList) {
        if (employee.supervisor_id === null) {
            continue;
        }

        if (!childrenBySupervisor.has(employee.supervisor_id)) {
            childrenBySupervisor.set(employee.supervisor_id, []);
        }

        childrenBySupervisor.get(employee.supervisor_id).push(employee);
    }

    return childrenBySupervisor;
}

// -----------------------------------------------------------------------------
// Problem 1: Calculate Employee Depth
// -----------------------------------------------------------------------------

function getEmployeeDepth(employeeList, employeeId) {
    const employeeById = buildEmployeeMap(employeeList);
    const visited = new Set();

    function findDepth(currentId) {
        const employee = employeeById.get(currentId);

        if (employee === undefined || visited.has(currentId)) {
            return -1;
        }

        if (employee.supervisor_id === null) {
            return 0;
        }

        visited.add(currentId);
        const supervisorDepth = findDepth(employee.supervisor_id);

        if (supervisorDepth === -1) {
            return -1;
        }

        return supervisorDepth + 1;
    }

    return findDepth(employeeId);
}

// -----------------------------------------------------------------------------
// Problem 2: Get All Subordinates
// -----------------------------------------------------------------------------

function getAllSubordinates(employeeList, managerId) {
    const employeeById = buildEmployeeMap(employeeList);

    if (!employeeById.has(managerId)) {
        return [];
    }

    const childrenBySupervisor = buildChildrenIndex(employeeList);
    const subordinates = [];
    const visited = new Set([managerId]);

    function collectSubordinates(currentManagerId, relativeDepth) {
        const directReports = childrenBySupervisor.get(currentManagerId) || [];

        for (const employee of directReports) {
            if (visited.has(employee.id)) {
                continue;
            }

            visited.add(employee.id);
            subordinates.push({
                id: employee.id,
                name: employee.name,
                relative_depth: relativeDepth
            });

            collectSubordinates(employee.id, relativeDepth + 1);
        }
    }

    collectSubordinates(managerId, 1);

    subordinates.sort((first, second) => {
        return first.relative_depth - second.relative_depth || first.id - second.id;
    });

    return subordinates;
}

// -----------------------------------------------------------------------------
// Problem 3: Find Path to CEO
// -----------------------------------------------------------------------------

function getPathToCeo(employeeList, employeeId) {
    const employeeById = buildEmployeeMap(employeeList);
    const visited = new Set();

    function buildPath(currentId) {
        const employee = employeeById.get(currentId);

        if (employee === undefined || visited.has(currentId)) {
            return null;
        }

        visited.add(currentId);

        if (employee.supervisor_id === null) {
            return [employee.id];
        }

        const supervisorPath = buildPath(employee.supervisor_id);

        if (supervisorPath === null) {
            return null;
        }

        return [employee.id, ...supervisorPath];
    }

    return buildPath(employeeId) || [];
}

// -----------------------------------------------------------------------------
// Problem 4: Lowest Common Manager
// -----------------------------------------------------------------------------

function findLowestCommonManager(employeeList, empId1, empId2) {
    const employeeById = buildEmployeeMap(employeeList);

    if (!employeeById.has(empId1) || !employeeById.has(empId2)) {
        return null;
    }

    const firstPath = getPathToCeo(employeeList, empId1);
    const secondPath = getPathToCeo(employeeList, empId2);

    if (firstPath.length === 0 || secondPath.length === 0) {
        return null;
    }

    const secondPathIds = new Set(secondPath);
    const distanceInSecondPath = new Map();

    for (let index = 0; index < secondPath.length; index++) {
        distanceInSecondPath.set(secondPath[index], index);
    }

    for (let firstDistance = 0; firstDistance < firstPath.length; firstDistance++) {
        const possibleManagerId = firstPath[firstDistance];

        if (secondPathIds.has(possibleManagerId)) {
            const manager = employeeById.get(possibleManagerId);

            return {
                manager_id: manager.id,
                manager_name: manager.name,
                distance_to_emp1: firstDistance,
                distance_to_emp2: distanceInSecondPath.get(possibleManagerId)
            };
        }
    }

    return null;
}

// -----------------------------------------------------------------------------
// Problem 5: Total Team Salary
// -----------------------------------------------------------------------------

function calculateTeamSalary(employeeList, managerId) {
    const employeeById = buildEmployeeMap(employeeList);

    if (!employeeById.has(managerId)) {
        return 0;
    }

    const childrenBySupervisor = buildChildrenIndex(employeeList);
    const visited = new Set();

    function sumTeamSalary(employeeId) {
        if (visited.has(employeeId)) {
            return 0;
        }

        visited.add(employeeId);
        const employee = employeeById.get(employeeId);
        const directReports = childrenBySupervisor.get(employeeId) || [];
        let totalSalary = employee.salary;

        for (const report of directReports) {
            totalSalary += sumTeamSalary(report.id);
        }

        return totalSalary;
    }

    return sumTeamSalary(managerId);
}

// -----------------------------------------------------------------------------
// Tests and demonstration
// -----------------------------------------------------------------------------

function assertEqual(actual, expected, testName) {
    const actualText = JSON.stringify(actual);
    const expectedText = JSON.stringify(expected);

    if (actualText !== expectedText) {
        throw new Error(`${testName}: expected ${expectedText}, received ${actualText}`);
    }

    console.log(`PASS: ${testName} -> ${actualText}`);
}

function runTests() {
    console.log("Problem 1 - Employee depth");
    assertEqual(getEmployeeDepth(employees, 1), 0, "CEO depth");
    assertEqual(getEmployeeDepth(employees, 2), 1, "direct report depth");
    assertEqual(getEmployeeDepth(employees, 7), 3, "middle employee depth");
    assertEqual(getEmployeeDepth(employees, 12), 4, "deep employee depth");
    assertEqual(getEmployeeDepth(employees, 999), -1, "missing employee depth");

    console.log("\nProblem 2 - All subordinates");
    assertEqual(getAllSubordinates(employees, 2), [
        { id: 4, name: "David Brown", relative_depth: 1 },
        { id: 5, name: "Eve Davis", relative_depth: 1 },
        { id: 7, name: "Grace Lee", relative_depth: 2 },
        { id: 8, name: "Henry Martinez", relative_depth: 2 },
        { id: 9, name: "Ivy Chen", relative_depth: 2 },
        { id: 10, name: "Jack Thompson", relative_depth: 2 },
        { id: 12, name: "Liam Garcia", relative_depth: 3 }
    ], "Bob's subordinates");
    assertEqual(getAllSubordinates(employees, 6), [
        { id: 11, name: "Kelly Anderson", relative_depth: 1 }
    ], "Frank's subordinates");
    assertEqual(getAllSubordinates(employees, 12), [], "leaf has no subordinates");
    assertEqual(getAllSubordinates(employees, 999), [], "missing manager subordinates");

    console.log("\nProblem 3 - Path to CEO");
    assertEqual(getPathToCeo(employees, 12), [12, 7, 4, 2, 1], "Liam's path");
    assertEqual(getPathToCeo(employees, 1), [1], "CEO path");
    assertEqual(getPathToCeo(employees, 5), [5, 2, 1], "Eve's path");
    assertEqual(getPathToCeo(employees, 999), [], "missing employee path");

    console.log("\nProblem 4 - Lowest common manager");
    assertEqual(findLowestCommonManager(employees, 12, 9), {
        manager_id: 2,
        manager_name: "Bob Smith",
        distance_to_emp1: 3,
        distance_to_emp2: 2
    }, "Liam and Ivy");
    assertEqual(findLowestCommonManager(employees, 8, 10), {
        manager_id: 4,
        manager_name: "David Brown",
        distance_to_emp1: 1,
        distance_to_emp2: 1
    }, "Henry and Jack");
    assertEqual(findLowestCommonManager(employees, 1, 12), {
        manager_id: 1,
        manager_name: "Alice Johnson",
        distance_to_emp1: 0,
        distance_to_emp2: 4
    }, "ancestor and descendant");
    assertEqual(findLowestCommonManager(employees, 7, 7), {
        manager_id: 7,
        manager_name: "Grace Lee",
        distance_to_emp1: 0,
        distance_to_emp2: 0
    }, "same employee");
    assertEqual(findLowestCommonManager(employees, 999, 1), null, "missing employee manager");

    console.log("\nProblem 5 - Team salary");
    assertEqual(calculateTeamSalary(employees, 1), 1490000, "CEO team");
    assertEqual(calculateTeamSalary(employees, 4), 505000, "middle manager team");
    assertEqual(calculateTeamSalary(employees, 7), 170000, "two-person team");
    assertEqual(calculateTeamSalary(employees, 12), 50000, "leaf employee team");
    assertEqual(calculateTeamSalary(employees, 999), 0, "missing manager team");
}

if (typeof require === "undefined" || require.main === module) {
    runTests();
}

if (typeof module !== "undefined") {
    module.exports = {
        employees,
        getEmployeeDepth,
        getAllSubordinates,
        getPathToCeo,
        findLowestCommonManager,
        calculateTeamSalary
    };
}
