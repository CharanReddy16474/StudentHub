
document.addEventListener("DOMContentLoaded", async function () {

    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    const csrfInput = document.getElementById("csrfToken");
    const loginButton = document.getElementById("loginButton");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
        message.hidden = false;
    }

    // Display messages after a login attempt
    const params = new URLSearchParams(window.location.search);

    if (params.get("error") === "true") {
        showMessage(
            "Invalid email or password. Please try again.",
            "error"
        );
    } else if (params.get("logout") === "true") {
        showMessage(
            "You have been logged out successfully.",
            "success"
        );
    }

    // Show or hide the password
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
            togglePassword.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
            togglePassword.setAttribute("aria-label", "Show password");
        }
    });

    // Load a CSRF token before enabling the login form
    loginButton.disabled = true;

    try {
        const response = await fetch("/api/auth/csrf", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Unable to obtain security token.");
        }

        const data = await response.json();

        csrfInput.value = data.token;
        loginButton.disabled = false;

    } catch (error) {

        showMessage(
            "Unable to prepare secure login. Refresh the page and try again.",
            "error"
        );
    }

    // The form submits normally to Spring Security at POST /login.
    form.addEventListener("submit", function (event) {

        if (!csrfInput.value) {
            event.preventDefault();

            showMessage(
                "The security token is missing. Refresh the page and try again.",
                "error"
            );
        }
    });

});
