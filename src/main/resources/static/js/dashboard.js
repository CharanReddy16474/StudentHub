document.addEventListener("DOMContentLoaded", async function () {

    const sidebarName = document.getElementById("sidebarStudentName");
    const topbarName = document.getElementById("topbarStudentName");
    const welcomeName = document.getElementById("welcomeStudentName");

    const studentNumber = document.getElementById("studentNumber");
    const department = document.getElementById("studentDepartment");
    const semester = document.getElementById("studentSemester");
    const courseCount = document.getElementById("enrolledCourseCount");

    const dashboardMessage =
        document.getElementById("dashboardMessage");

    function showMessage(message) {
        if (dashboardMessage) {
            dashboardMessage.textContent = message;
            dashboardMessage.hidden = false;
        }
    }

    function setStudentInitial(name) {
        const initial = name && name.trim()
            ? name.trim().charAt(0).toUpperCase()
            : "S";

        document.querySelectorAll(".sidebar .avatar, .account-avatar")
            .forEach(function (avatar) {
                avatar.textContent = initial;
            });
    }

    try {
        const response = await fetch("/api/dashboard", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });

        // If Spring Security redirects an expired session to login,
        // return to the login page.
        if (
            response.redirected &&
            new URL(response.url).pathname === "/login.html"
        ) {
            window.location.replace("/login.html");
            return;
        }

        if (response.status === 401 || response.status === 403) {
            window.location.replace("/login.html");
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load student details.");
        }

        const data = await response.json();

        const name = typeof data.fullName === "string" &&
                     data.fullName.trim()
            ? data.fullName.trim()
            : "Student";

        // Update the name throughout the dashboard.
        if (sidebarName) {
            sidebarName.textContent = name;
        }

        if (topbarName) {
            topbarName.textContent = name;
        }

        if (welcomeName) {
            welcomeName.textContent = name + "!";
        }

        // Update avatar initials for the logged-in student.
        setStudentInitial(name);

        // Display the student's academic information.
        if (studentNumber) {
            studentNumber.textContent =
                data.studentNumber || "Not available";
        }

        if (department) {
            department.textContent =
                data.department || "Not available";
        }

        if (semester) {
            semester.textContent =
                data.semester != null
                    ? "Semester " + data.semester
                    : "Not available";
        }

        if (courseCount) {
            courseCount.textContent =
                data.enrolledCourseCount ?? 0;
        }

        if (dashboardMessage) {
            dashboardMessage.hidden = true;
            dashboardMessage.textContent = "";
        }

    } catch (error) {
        console.error("Dashboard loading error:", error);

        showMessage(
            "Unable to load your student details. Please refresh the page."
        );
    }
});