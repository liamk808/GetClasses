
// Global variable to store the JSON data
var jsonData;

// Function to retrieve the embedded JSON data
function retrieveJSONData() {
    fetch('classes.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
    // Call the function that depends on the JSON data
    onPageLoad();
}

// Function to be executed when the HTML page is loaded
function onPageLoad() {
    // Code that depends on the JSON data embedded in the HTML file
    console.log(jsonData);
}

// Function to add a class to the selected classes table
function addClass() {
    // Variables pointing to the department input, course input, and selected classes table
    var departmentInput = document.getElementById("department");
    var courseInput = document.getElementById("course");
    var selectedClassesTable = document.getElementById("selected-classes").getElementsByTagName('tbody')[0];
    var core1Input = document.getElementById("core1");
    var core2Input = document.getElementById("core2");
    var yearInput = document.getElementById("year");
    var termInput = document.getElementById("term");
    var professorInput = document.getElementById("professor");

    // Get the values entered by the user for department and course
    var department = departmentInput.value.toUpperCase();
    var course = courseInput.value;
    var core1 = core1Input.value;
    var core2 = core2Input.value;
    var term = termInput.value;
    var year = parseInt(yearInput.value, 10); // Parse the year as an integer
    var professor = professorInput.value;

    //Check if inputs are filled
    if (year === "") {
        alert("Input a Year");
        return;
    }

    if (term === "") {
        alert("Input a Term");
        return;
    }

    if (year < "10" || year > "99") {
        alert("Year must be from 01-99");
        return;
    }

    // Get the course title based on the department and course number
    var courseTitle = getCourseTitle(department, course);

    if (department && course && courseTitle) {
        var isDuplicate = false;

        // Check if the class already exists in the selected classes table
        for (var i = 0; i < selectedClassesTable.rows.length; i++) {
            var existingDepartment = selectedClassesTable.rows[i].cells[0].textContent.toUpperCase();
            var existingCourse = selectedClassesTable.rows[i].cells[1].textContent.toUpperCase();

            if (existingDepartment === department && existingCourse === course) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            var row = selectedClassesTable.insertRow();
            var departmentCell = row.insertCell(0);
            var courseNumCell = row.insertCell(1);
            var courseTitleCell = row.insertCell(2);
            var yearCell = row.insertCell(3);
            var termCell = row.insertCell(4);
            var core1Cell = row.insertCell(5);
            var core2Cell = row.insertCell(6);
            var deleteCell = row.insertCell(7); // Insert a cell for the delete button
            var professorCell = row.insertCell(8);

            departmentCell.textContent = department;
            courseNumCell.textContent = course;
            courseTitleCell.textContent = courseTitle;
            core1Cell.textContent = core1;
            core2Cell.textContent = core2;
            termCell.textContent = term;
            yearCell.textContent = year;
            professorCell.textContent = professor;

            var deleteButton = document.createElement("button"); // Create the delete button element
            deleteButton.textContent = "x"; // Set the button text to "x"
            deleteButton.className = "delete-button"; // Add a class for styling
            deleteButton.addEventListener("click", function () { // Add a click event listener
                var row = this.parentNode.parentNode; // Get the parent row
                row.parentNode.removeChild(row); // Remove the row from the table
            });
            deleteCell.appendChild(deleteButton); // Append the delete button to the delete cell

            departmentInput.value = "";
            courseInput.value = "";
            yearInput.value = "";
            termInput.value = "";
            core1Input.value = "";
            core2Input.value = "";
            professorInput.value = "";
        } else {
            alert("Class already selected");
        }
    } else {
        alert("Invalid class");
    }
}

// Function to get the course title based on department and course number
function getCourseTitle(department, course) {
    if (department in jsonData) {
        var courses = jsonData[department];
        for (const courseObj of courses) {
            if (courseObj["Class Number"] === course) {
                return courseObj["Class Title"];
            }
        }
    }
    return "";
}

// Function to handle "Enter" key press event in the course input field
function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        addClass();
        event.preventDefault(); // Prevent form submission on "Enter" key press
    }
}

function downloadCSV() {
    // Retrieve the table element
    var table = document.getElementById('selected-classes');
    var nameInput = document.getElementById('firstname');

    var name = nameInput.value;
    var fileName = name + "_classes.csv"; // Modify the file name format


    // Create an empty array to store the CSV rows
    var rows = [];

    //Check if table empty
    if (table.rows.length === 1) {
        alert("Table is empty");
        return;
    }

    if (name === "") {
        alert("Input a Name");
        return;
    }
    // Iterate over the table rows
    for (var i = 1; i < table.rows.length; i++) {
        var row = [];

        // Insert User's Name in the first column
        row.push('"' + name + '"');

        // Iterate over the table cells in each row
        for (var j = 0; j < table.rows[i].cells.length - 1; j++) { // Exclude the last delete cell
            // Get the cell value and push it to the row array
            var cellValue = table.rows[i].cells[j].textContent.trim();
            row.push('"' + cellValue + '"');
        }
        // Join the row array with commas and push it to the rows array
        rows.push(row.join(','));
    }

    // Join the rows array with line breaks to form the CSV content
    var csvContent = rows.join('\n');

    // Create a Blob object with the CSV data
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary link element to download the CSV file
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link element to the document body
    document.body.appendChild(link);

    // Click the link element to trigger the download
    link.click();

    // Remove the link element from the document body
    document.body.removeChild(link);
}

// Function to retrieve the names from the JSON file and populate the dropdown
function populateNamesDropdown() {
    fetch('names.json')
        .then(response => response.json())
        .then(data => {
            var namesDropdown = document.getElementById('firstname');

            // Iterate over the names and create an option element for each name
            data.Names.forEach(name => {
                var option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                namesDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Call the function to populate the dropdown when the page is loaded
window.onload = populateNamesDropdown;
