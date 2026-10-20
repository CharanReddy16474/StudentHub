
document.addEventListener("DOMContentLoaded", function () {
    let csrfToken = "";
    let profileData = null;

    const profileMessage = document.getElementById("profileMessage");
    const editProfileForm = document.getElementById("editProfileForm");
    const changePasswordForm = document.getElementById("changePasswordForm");
    const availableCoursesList = document.getElementById("availableCoursesList");
    const myCoursesList = document.getElementById("myCoursesList");
    const availableCoursesMessage = document.getElementById("availableCoursesMessage");
    const myCoursesMessage = document.getElementById("myCoursesMessage");
    const logoutCsrfToken = document.getElementById("logoutCsrfToken");
    const logoutButton = document.getElementById("logoutButton");

    function showMessage(message, type) {
        if (!profileMessage) return;

        profileMessage.textContent = message;
        profileMessage.className = "message " + type;
        profileMessage.hidden = false;
        profileMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    function clearMessage() {
        if (profileMessage) {
            profileMessage.hidden = true;
        }
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // ==========================================
    // CSRF TOKEN AND API REQUESTS
    // ==========================================

    async function loadCsrfToken() {
        const response = await fetch("/api/auth/csrf", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });

        if (
            response.redirected &&
            new URL(response.url).pathname === "/login.html"
        ) {
            window.location.replace("/login.html");
            throw new Error("Please log in again.");
        }

        if (!response.ok) {
            throw new Error("Could not load the security token.");
        }

        const data = await response.json();
        csrfToken = data.token;

        if (logoutCsrfToken) {
            logoutCsrfToken.value = csrfToken;
        }

        if (logoutButton) {
            logoutButton.disabled = false;
        }
    }

    async function apiRequest(url, options) {
        const settings = options || {};
        const method = (settings.method || "GET").toUpperCase();

        const headers = {
            "Accept": "application/json"
        };

        if (settings.body !== undefined) {
            headers["Content-Type"] = "application/json";
        }

        if (method !== "GET" && method !== "HEAD") {
            if (!csrfToken) {
                throw new Error(
                    "Security token is missing. Refresh the page."
                );
            }

            headers["X-CSRF-TOKEN"] = csrfToken;
        }

        const response = await fetch(url, {
            method: method,
            credentials: "same-origin",
            headers: headers,
            body: settings.body
        });

        if (
            response.redirected &&
            new URL(response.url).pathname === "/login.html"
        ) {
            window.location.replace("/login.html");
            throw new Error(
                "Your session has expired. Please log in again."
            );
        }

        let data = null;
        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            await response.text();
        }

        if (!response.ok) {
            if (response.status === 401) {
                window.location.replace("/login.html");
                throw new Error("Please log in again.");
            }

            if (response.status === 403) {
                throw new Error(
                    "Request rejected. Refresh the page and try again."
                );
            }

            throw new Error(
                (data && (data.message || data.detail)) ||
                "The request failed. Please try again."
            );
        }

        return data;
    }

    // ==========================================
    // DISPLAY PROFILE
    // ==========================================

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent =
                value == null || value === ""
                    ? "Not provided"
                    : value;
        }
    }

    function setStudentInitial(name) {
        const initial = name && name.trim()
            ? name.trim().charAt(0).toUpperCase()
            : "S";

        ["sidebarAvatar", "profileAvatar"].forEach(function (id) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = initial;
            }
        });
    }

    function populateEditForm() {
        if (!profileData || !editProfileForm) {
            return;
        }

        const fullName = document.getElementById("editFullName");
        const phone = document.getElementById("editPhone");
        const email = document.getElementById("editEmail");
        const studentNumber =
            document.getElementById("editStudentNumber");

        if (fullName) {
            fullName.value = profileData.fullName || "";
        }

        if (phone) {
            phone.value = profileData.phone || "";
        }

        if (email) {
            email.value = profileData.email || "";
        }

        if (studentNumber) {
            studentNumber.value = profileData.studentNumber || "";
        }
    }

    function displayProfile(data) {
        profileData = data;

        const fullName = data.fullName || "Student";

        setStudentInitial(fullName);

        setText("sidebarStudentName", fullName);
        setText("profileHeaderName", fullName);
        setText(
            "profileHeaderDepartment",
            data.department || "Not provided"
        );

        setText("profileFullName", fullName);
        setText("profileEmail", data.email);
        setText("profileStudentNumber", data.studentNumber);
        setText("profilePhone", data.phone);
        setText("profileDepartment", data.department);

        setText(
            "profileSemester",
            data.semester == null
                ? "Not provided"
                : "Semester " + data.semester
        );

        populateEditForm();
    }

    async function loadProfile() {
        const data = await apiRequest("/api/profile");
        displayProfile(data);
    }

    // ==========================================
    // RESET FORM - FIXED
    // ==========================================

    function resetSavedProfileForm() {
        if (!editProfileForm) {
            return;
        }

        if (!profileData) {
            showMessage(
                "Your profile is still loading. Please wait and try again.",
                "error"
            );
            return;
        }

        // Restore values from the latest saved profile.
        populateEditForm();

        showMessage(
            "Form reset successfully. Your last saved details have been restored.",
            "success"
        );
    }

    // The HTML button calls this function directly.
    window.resetStudentHubProfileForm = resetSavedProfileForm;

    // ==========================================
    // EDIT AND SAVE PROFILE
    // ==========================================

    if (editProfileForm) {
        editProfileForm.addEventListener(
            "reset",
            function (event) {
                event.preventDefault();
                populateEditForm();
            }
        );

        editProfileForm.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();
                clearMessage();

                const submitButton =
                    document.getElementById("saveProfileButton");

                const fullNameInput =
                    document.getElementById("editFullName");

                const phoneInput =
                    document.getElementById("editPhone");

                const requestData = {
                    fullName: fullNameInput
                        ? fullNameInput.value.trim()
                        : "",
                    phone: phoneInput
                        ? phoneInput.value.trim()
                        : ""
                };

                if (!requestData.fullName) {
                    showMessage(
                        "Full name is required.",
                        "error"
                    );
                    return;
                }

                if (
                    requestData.fullName.length > 100 ||
                    requestData.phone.length > 20
                ) {
                    showMessage(
                        "Please check the length of your profile details.",
                        "error"
                    );
                    return;
                }

                submitButton.disabled = true;
                submitButton.textContent = "Saving...";

                try {
                    const updatedProfile = await apiRequest(
                        "/api/profile",
                        {
                            method: "PUT",
                            body: JSON.stringify(requestData)
                        }
                    );

                    // Update saved values after a successful save.
                    displayProfile(updatedProfile);

                    showMessage(
                        "Your profile has been updated successfully.",
                        "success"
                    );
                } catch (error) {
                    showMessage(error.message, "error");
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = "Save Changes";
                }
            }
        );
    }

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    if (changePasswordForm) {
        changePasswordForm.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();
                clearMessage();

                const currentPassword =
                    changePasswordForm.elements.currentPassword.value;

                const newPassword =
                    changePasswordForm.elements.newPassword.value;

                const confirmNewPassword =
                    changePasswordForm.elements.confirmNewPassword.value;

                if (
                    newPassword.length < 8 ||
                    newPassword.length > 72
                ) {
                    showMessage(
                        "New password must contain 8 to 72 characters.",
                        "error"
                    );
                    return;
                }

                if (newPassword !== confirmNewPassword) {
                    showMessage(
                        "New password and confirmation do not match.",
                        "error"
                    );
                    return;
                }

                const button =
                    document.getElementById("changePasswordButton");

                button.disabled = true;
                button.textContent = "Updating...";

                try {
                    const result = await apiRequest(
                        "/api/profile/change-password",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                currentPassword: currentPassword,
                                newPassword: newPassword,
                                confirmNewPassword: confirmNewPassword
                            })
                        }
                    );

                    changePasswordForm.reset();

                    showMessage(
                        result.message ||
                        "Password changed successfully.",
                        "success"
                    );
                } catch (error) {
                    showMessage(error.message, "error");
                } finally {
                    button.disabled = false;
                    button.textContent = "Update Password";
                }
            }
        );
    }

    // ==========================================
    // COURSE CARDS
    // ==========================================

    function courseCardHTML(course, mode) {
        const id = escapeHTML(course.id);
        const code = escapeHTML(course.courseCode);
        const name = escapeHTML(course.courseName);

        const description = escapeHTML(
            course.description || "No course description available."
        );

        const credits = course.credits == null
            ? "Not specified"
            : escapeHTML(course.credits);

        const status = course.enrollmentStatus || "AVAILABLE";

        let badgeClass = "status-available";
        let badgeText = "Available";
        let actionHTML = "";

        if (status === "ENROLLED") {
            badgeClass = "status-enrolled";
            badgeText = "Enrolled";

            if (mode === "available") {
                actionHTML =
                    '<button type="button" class="course-action" disabled>' +
                    'Already Enrolled</button>';
            } else {
                actionHTML =
                    '<button type="button" class="course-action withdraw-button" ' +
                    'data-action="withdraw" data-course-id="' + id + '">' +
                    'Withdraw from Course</button>';
            }
        } else if (status === "WITHDRAWN") {
            badgeClass = "status-withdrawn";
            badgeText = "Withdrawn";

            if (mode === "available") {
                actionHTML =
                    '<button type="button" class="course-action" ' +
                    'data-action="enroll" data-course-id="' + id + '">' +
                    'Enroll Again</button>';
            }
        } else if (mode === "available") {
            actionHTML =
                '<button type="button" class="course-action" ' +
                'data-action="enroll" data-course-id="' + id + '">' +
                'Enroll in Course</button>';
        }

        return (
            '<article class="course-card">' +
                '<div class="course-card-header">' +
                    '<span class="course-code">' + code + '</span>' +
                    '<span class="course-status ' + badgeClass + '">' +
                        badgeText +
                    '</span>' +
                '</div>' +
                '<h3>' + name + '</h3>' +
                '<p class="course-description">' +
                    description +
                '</p>' +
                '<p class="course-credits">' +
                    'Credits: ' + credits +
                '</p>' +
                actionHTML +
            '</article>'
        );
    }

    function renderCourses(container, courses, mode) {
        if (!container) {
            return;
        }

        if (!Array.isArray(courses) || courses.length === 0) {
            const title = mode === "available"
                ? "No available courses"
                : "You have not enrolled in any courses yet.";

            const description = mode === "available"
                ? "Please check again later."
                : "Explore Available Courses above to get started.";

            container.innerHTML =
                '<div class="empty-state">' +
                    '<strong>' + title + '</strong>' +
                    '<span>' + description + '</span>' +
                '</div>';

            return;
        }

        container.innerHTML = courses.map(function (course) {
            return courseCardHTML(course, mode);
        }).join("");
    }

    function setCourseMessage(element, message, isError) {
        if (!element) {
            return;
        }

        element.textContent = message;
        element.hidden = !message;

        element.className = isError
            ? "section-message message error"
            : "section-message";
    }

    // ==========================================
    // LOAD AVAILABLE AND ENROLLED COURSES
    // ==========================================

    async function loadCourses() {
        setCourseMessage(
            availableCoursesMessage,
            "Loading available courses...",
            false
        );

        setCourseMessage(
            myCoursesMessage,
            "Loading your courses...",
            false
        );

        try {
            const results = await Promise.all([
                apiRequest("/api/courses"),
                apiRequest("/api/courses/mine")
            ]);

            renderCourses(
                availableCoursesList,
                results[0],
                "available"
            );

            renderCourses(
                myCoursesList,
                results[1],
                "mine"
            );

            setCourseMessage(
                availableCoursesMessage,
                "",
                false
            );

            setCourseMessage(
                myCoursesMessage,
                "",
                false
            );
        } catch (error) {
            setCourseMessage(
                availableCoursesMessage,
                error.message || "Could not load available courses.",
                true
            );

            setCourseMessage(
                myCoursesMessage,
                error.message || "Could not load your courses.",
                true
            );
        }
    }

    // ==========================================
    // ENROLL OR WITHDRAW FROM A COURSE
    // ==========================================

    async function handleCourseAction(event) {
        const button = event.target.closest(
            "button[data-action][data-course-id]"
        );

        if (!button) {
            return;
        }

        const action = button.dataset.action;
        const courseId = button.dataset.courseId;

        if (
            !courseId ||
            !["enroll", "withdraw"].includes(action)
        ) {
            return;
        }

        const isEnroll = action === "enroll";

        const endpoint = isEnroll
            ? "/api/courses/" +
                encodeURIComponent(courseId) + "/enroll"
            : "/api/courses/" +
                encodeURIComponent(courseId) + "/withdraw";

        button.disabled = true;
        button.textContent = isEnroll
            ? "Enrolling..."
            : "Processing...";

        clearMessage();

        try {
            const result = await apiRequest(
                endpoint,
                { method: "POST" }
            );

            showMessage(
                result.message ||
                (isEnroll
                    ? "Course enrollment successful."
                    : "Course withdrawal successful."),
                "success"
            );

            await loadCourses();
        } catch (error) {
            showMessage(error.message, "error");

            button.disabled = false;
            button.textContent = isEnroll
                ? "Enroll in Course"
                : "Withdraw from Course";
        }
    }

    if (availableCoursesList) {
        availableCoursesList.addEventListener(
            "click",
            handleCourseAction
        );
    }

    if (myCoursesList) {
        myCoursesList.addEventListener(
            "click",
            handleCourseAction
        );
    }

    // ==========================================
    // REFRESH COURSES
    // ==========================================

    const refreshButton =
        document.getElementById("refreshCoursesButton");

    if (refreshButton) {
        refreshButton.addEventListener(
            "click",
            async function () {
                refreshButton.disabled = true;
                refreshButton.textContent = "Refreshing...";

                await loadCourses();

                refreshButton.disabled = false;
                refreshButton.textContent = "Refresh Courses";
            }
        );
    }

    // ==========================================
    // INITIALIZE PAGE
    // ==========================================

    async function initializePage() {
        try {
            await loadCsrfToken();
            await loadProfile();
            await loadCourses();
        } catch (error) {
            showMessage(
                error.message ||
                "Unable to load your profile. Please refresh the page.",
                "error"
            );
        }
    }

    initializePage();
});
