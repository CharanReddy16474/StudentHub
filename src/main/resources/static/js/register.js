
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registrationForm");
    const message = document.getElementById("formMessage");
    const submitButton = document.getElementById("submitButton");

    if (!form || !message || !submitButton) {
        return;
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "form-message " + type;
        message.hidden = false;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const password = form.elements.password.value;
        const confirmPassword = form.elements.confirmPassword.value;

        if (password !== confirmPassword) {
            showMessage(
                "Password and confirm password do not match.",
                "error"
            );
            return;
        }

        const registrationData = {
            email: form.elements.email.value.trim().toLowerCase(),
            password: password,
            confirmPassword: confirmPassword,
            studentNumber: form.elements.studentNumber.value.trim(),
            fullName: form.elements.fullName.value.trim(),
            phone: form.elements.phone.value.trim(),
            department: form.elements.department.value.trim(),
            semester: Number(form.elements.semester.value)
        };

        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";
        message.hidden = true;

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registrationData)
            });

            let result = {};

            try {
                result = await response.json();
            } catch (parseError) {
                result = {};
            }

            if (!response.ok) {
                showMessage(
                    result.message ||
                    result.detail ||
                    "Registration failed. Check your details and try again.",
                    "error"
                );
                return;
            }

            showMessage(
                "Your account has been created successfully! You can now log in.",
                "success"
            );

            form.reset();

        } catch (error) {

            showMessage(
                "Unable to connect to StudentHub. Check that the backend is running and try again.",
                "error"
            );

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML =
                'Create Student Account <span>&rarr;</span>';
        }
    });
});
