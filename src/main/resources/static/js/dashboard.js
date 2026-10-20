document.addEventListener("DOMContentLoaded", async function () {

    const sidebarName = document.getElementById("sidebarStudentName");
    const topbarName = document.getElementById("topbarStudentName");
    const welcomeName = document.getElementById("welcomeStudentName");

    const studentNumber = document.getElementById("studentNumber");
    const department = document.getElementById("studentDepartment");
    const semester = document.getElementById("studentSemester");
    const courseCount = document.getElementById("enrolledCourseCount");
    const dashboardMessage = document.getElementById("dashboardMessage");

    /* ==========================================
       RESPONSIVE CSS
       ========================================== */

    function addResponsiveStyles() {

        if (document.getElementById("studentHubResponsiveStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "studentHubResponsiveStyles";

        style.textContent = `
		/* Remove Welcome Art decorations on all screen sizes */
		.welcome-banner .welcome-art {
		    display: none !important;
		}

            /* Hamburger button */

            .mobile-menu-toggle {
                display: none;
                align-items: center;
                justify-content: center;
                position: relative;
                flex: 0 0 44px;
                width: 44px;
                height: 44px;
                padding: 0;
                border: 1px solid #e5dcf5;
                border-radius: 11px;
                background: #ffffff;
                color: #6840ba;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            .mobile-menu-toggle span {
                position: absolute;
                display: block;
                width: 21px;
                height: 2px;
                border-radius: 3px;
                background: currentColor;
                transition: transform .22s ease, opacity .18s ease;
            }

            .mobile-menu-toggle span:nth-child(1) {
                transform: translateY(-6px);
            }

            .mobile-menu-toggle span:nth-child(2) {
                transform: translateY(0);
            }

            .mobile-menu-toggle span:nth-child(3) {
                transform: translateY(6px);
            }

            .mobile-menu-toggle.is-active span:nth-child(1) {
                transform: rotate(45deg);
            }

            .mobile-menu-toggle.is-active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-toggle.is-active span:nth-child(3) {
                transform: rotate(-45deg);
            }

            /* Mobile drawer background */

            .mobile-nav-backdrop {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 1200;
                width: 100%;
                height: 100%;
                padding: 0;
                border: 0;
                background: rgba(18, 12, 34, .55);
                cursor: pointer;
            }

            .mobile-nav-backdrop.is-visible {
                display: block;
            }

            .mobile-welcome-image {
                display: none !important;
            }

            /* Laptop and tablet layouts */

            @media (min-width: 761px) and (max-width: 1250px) {

                .main-content {
                    padding-left: 26px;
                    padding-right: 26px;
                }

                .overview-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .quick-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }

            /* ======================================
               MOBILE LAYOUT
               ====================================== */

            @media (max-width: 760px) {

                html,
                body {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                body.mobile-nav-open {
                    overflow: hidden !important;
                    touch-action: none;
                }

                .app-layout {
                    display: block !important;
                    width: 100%;
                    min-width: 0;
                    min-height: 100vh;
                }

                /* Mobile sidebar drawer */

                .sidebar.mobile-drawer {
                    position: fixed !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: auto !important;
                    z-index: 1201 !important;

                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch;

                    width: min(84vw, 310px) !important;
                    min-width: 0 !important;
                    max-width: 88vw;

                    height: 100vh !important;
                    height: 100dvh !important;
                    max-height: none !important;

                    padding: 22px 17px 18px !important;
                    margin: 0 !important;

                    overflow-x: hidden !important;
                    overflow-y: auto !important;
                    overscroll-behavior: contain;

                    transform: translateX(-105%);
                    visibility: hidden;
                    pointer-events: none;

                    transition:
                        transform .24s ease,
                        visibility 0s linear .24s;

                    box-shadow: 10px 0 34px rgba(21, 12, 43, .2);
                }

                .sidebar.mobile-drawer.is-mobile-open {
                    transform: translateX(0);
                    visibility: visible;
                    pointer-events: auto;

                    transition:
                        transform .24s ease,
                        visibility 0s;
                }

                /* ======================================
                   HEADER ALIGNMENT FIX
                   Hamburger | Dashboard title | Account
                   ====================================== */

                .mobile-menu-toggle {
                    display: inline-flex !important;
                }

                .main-content {
                    width: 100% !important;
                    min-width: 0 !important;
                    padding: clamp(15px, 4vw, 25px) !important;
                }

                .topbar {
                    display: grid !important;

                    /*
                     * Column 1: hamburger
                     * Column 2: heading
                     * Column 3: account chip
                     */
                    grid-template-columns: 44px minmax(0, 1fr) auto !important;
                    grid-template-rows: auto !important;

                    align-items: center !important;
                    justify-content: normal !important;
                    gap: 10px 8px !important;

                    width: 100%;
                    min-width: 0;
                    margin-bottom: 22px !important;
                }

                .topbar > div:first-of-type {
                    grid-column: 2 !important;
                    grid-row: 1 !important;

                    align-self: center !important;
                    min-width: 0 !important;
                    margin: 0 !important;
                }

                .topbar h1 {
                    max-width: 100%;
                    margin-top: 0;
                    margin-bottom: 0;

                    font-size: clamp(18px, 4.6vw, 26px) !important;
                    line-height: 1.2 !important;

                    overflow-wrap: anywhere;
                }

                .topbar .account-chip {
                    grid-column: 3 !important;
                    grid-row: 1 !important;

                    justify-self: end !important;
                    align-self: center !important;

                    display: flex !important;
                    align-items: center !important;

                    gap: 6px !important;
                    min-width: 0 !important;
                    max-width: 108px !important;

                    margin: 0 !important;
                    padding: 5px 7px !important;
                }

                .topbar .account-chip .account-avatar {
                    flex: 0 0 30px;
                    width: 30px;
                    height: 30px;
                }

                .topbar .account-text {
                    display: block;
                    min-width: 0 !important;
                    max-width: 60px;
                }

                .topbar .account-text span,
                .topbar .account-chip .account-arrow {
                    display: none !important;
                }

                .topbar .account-chip strong {
                    display: block;
                    max-width: 60px !important;

                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    white-space: nowrap !important;

                    font-size: 11px;
                }

                /* Welcome banner: complete image behind text */

                .welcome-banner {
                    position: relative !important;
                    isolation: isolate;

                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    justify-content: flex-start !important;

                    width: 100% !important;
                    min-width: 0;
                    min-height: clamp(305px, 82vw, 370px) !important;
                    height: auto !important;

                    padding: clamp(17px, 5vw, 25px) !important;
                    margin: 0;

                    overflow: hidden;
                    border-radius: 15px;

                    background-color: #32166b !important;

                    background-image:
                        linear-gradient(
                            90deg,
                            rgba(24, 12, 56, .67) 0%,
                            rgba(24, 12, 56, .48) 55%,
                            rgba(24, 12, 56, .26) 100%
                        ),
                        url("/images/studenthub-welcome.png") !important;

                    background-repeat: no-repeat, no-repeat !important;

                    /*
                     * Keep the complete image visible.
                     * This avoids cropping the sides.
                     */
                    background-size:
                        100% 100%,
                        contain !important;

                    background-position:
                        center center,
                        center center !important;
                }

                .welcome-banner .mobile-welcome-image {
                    display: none !important;
                }

                .welcome-banner .welcome-copy {
                    position: relative !important;
                    z-index: 2;

                    display: block !important;
                    width: 100% !important;
                    max-width: 390px !important;
                    min-width: 0;

                    margin: 0 !important;
                    padding: 0 !important;

                    background: transparent !important;
                }

                .welcome-tag {
                    display: inline-block;
                    max-width: 100%;

                    color: #f0e4ff;
                    font-size: 9px !important;
                    line-height: 1.5;
                    letter-spacing: 1.1px;

                    overflow-wrap: anywhere;
                }

                .welcome-copy h2 {
                    max-width: 100%;
                    margin: 10px 0 0 !important;

                    color: #ffffff;
                    font-size: clamp(23px, 6vw, 30px) !important;
                    line-height: 1.2 !important;
                    letter-spacing: -.3px;

                    overflow-wrap: anywhere;
                    word-break: normal;

                    text-shadow: 0 2px 12px rgba(0, 0, 0, .35);
                }

                .welcome-copy h2 span {
                    color: #fff0b9;
                }

                .welcome-copy p {
                    width: 100%;
                    max-width: 330px;

                    margin: 11px 0 0 !important;

                    color: #ffffff;
                    font-size: clamp(11px, 3vw, 13px) !important;
                    line-height: 1.55 !important;

                    overflow-wrap: anywhere;
                    text-shadow: 0 2px 9px rgba(0, 0, 0, .4);
                }

                .banner-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;

                    max-width: 100%;
                    min-height: 40px;

                    margin-top: 15px !important;
                    padding: 10px 13px !important;

                    border-radius: 8px;
                    background: #ffffff;
                    color: #6840ba;

                    font-size: 11px !important;
                    line-height: 1.4;
                    white-space: normal;
                }

                .banner-button span {
                    font-size: 15px;
                }

                .welcome-banner .welcome-art {
                    display: none !important;
                }

                /* Student overview */

                .overview-grid {
                    display: grid !important;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 10px;
                }

                .overview-card {
                    display: flex;
                    align-items: center;
                    gap: 9px;

                    min-width: 0;
                    margin: 0 !important;
                    padding: 13px 10px;
                }

                .overview-icon {
                    flex: 0 0 34px;
                    width: 34px;
                    height: 34px;
                    font-size: 17px;
                }

                .overview-card > div:last-child,
                .overview-card strong {
                    min-width: 0;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                .overview-card strong {
                    font-size: 12px;
                }

                .overview-label {
                    font-size: 10px;
                }

                /* Quick links */

                .quick-grid {
                    display: grid !important;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 10px;
                }

                .quick-card {
                    min-width: 0;
                    margin: 0 !important;
                    padding: 14px 11px;
                    gap: 8px;
                }

                .quick-icon {
                    flex: 0 0 32px;
                    width: 32px;
                    height: 32px;
                    font-size: 17px;
                }

                .quick-card-content {
                    min-width: 0;
                    padding-right: 5px;
                }

                .quick-card h3 {
                    font-size: 12px;
                    overflow-wrap: anywhere;
                }

                .quick-card p {
                    font-size: 10px;
                    line-height: 1.5;
                    overflow-wrap: anywhere;
                }

                /* Courses and footer */

                .section-heading {
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 8px 12px;
                }

                .course-summary {
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 11px;

                    min-width: 0;
                    padding: 15px;
                }

                .course-summary-content {
                    flex: 1 1 160px;
                    min-width: 0;
                }

                .course-summary h3,
                .course-summary p {
                    overflow-wrap: anywhere;
                }

                .course-summary p {
                    font-size: 11px;
                    line-height: 1.6;
                }

                .outline-button {
                    width: 100%;
                    margin-top: 3px;
                }

                .dashboard-footer {
                    display: block;
                    margin-top: 24px;
                }

                .dashboard-footer span {
                    display: block;
                    margin-bottom: 5px;
                }
            }

            /* Very small phones */

            @media (max-width: 380px) {

                .sidebar.mobile-drawer {
                    width: min(86vw, 290px) !important;
                }

                .main-content {
                    padding: 13px 10px 22px !important;
                }

                .topbar {
                    grid-template-columns: 40px minmax(0, 1fr) auto !important;
                    column-gap: 6px !important;
                }

                .mobile-menu-toggle {
                    flex-basis: 40px;
                    width: 40px;
                    height: 40px;
                }

                .topbar h1 {
                    font-size: clamp(16px, 4.4vw, 20px) !important;
                }

                .topbar .account-chip {
                    max-width: 40px !important;
                    padding: 4px !important;
                    justify-content: center !important;
                }

                .topbar .account-text {
                    display: none !important;
                }

                .welcome-banner {
                    min-height: 300px !important;
                    padding: 16px 12px !important;
                }

                .welcome-copy h2 {
                    font-size: 22px !important;
                    line-height: 1.2 !important;
                }

                .welcome-copy p {
                    font-size: 11px !important;
                }

                .overview-grid,
                .quick-grid {
                    grid-template-columns: minmax(0, 1fr);
                }

                .overview-card {
                    padding: 14px;
                }

                .quick-card {
                    padding: 15px 13px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .sidebar.mobile-drawer,
                .mobile-menu-toggle span,
                * {
                    transition-duration: .01ms !important;
                    animation-duration: .01ms !important;
                    scroll-behavior: auto !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* ==========================================
       MOBILE HAMBURGER NAVIGATION
       ========================================== */

    function setupMobileNavigation() {

        const sidebar = document.querySelector(".sidebar");
        const topbar = document.querySelector(".topbar");

        if (!sidebar || !topbar) {
            return;
        }

        addResponsiveStyles();

        /* Remove any image inserted by an older script */
        document.querySelectorAll(".mobile-welcome-image")
            .forEach(function (image) {
                image.remove();
            });

        if (document.getElementById("mobileMenuToggle")) {
            return;
        }

        if (!sidebar.id) {
            sidebar.id = "studentHubSidebar";
        }

        sidebar.classList.add("mobile-drawer");
        sidebar.setAttribute("aria-label", "Student navigation");

        const toggle = document.createElement("button");

        toggle.type = "button";
        toggle.id = "mobileMenuToggle";
        toggle.className = "mobile-menu-toggle";

        toggle.setAttribute("aria-label", "Open navigation menu");
        toggle.setAttribute("aria-controls", sidebar.id);
        toggle.setAttribute("aria-expanded", "false");

        toggle.innerHTML = `
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        `;

        topbar.insertBefore(toggle, topbar.firstElementChild);

        const backdrop = document.createElement("button");

        backdrop.type = "button";
        backdrop.className = "mobile-nav-backdrop";
        backdrop.setAttribute("aria-label", "Close navigation menu");
        backdrop.setAttribute("aria-hidden", "true");
        backdrop.tabIndex = -1;

        document.body.appendChild(backdrop);

        const mobileViewport = window.matchMedia("(max-width: 760px)");

        function openMenu() {

            if (!mobileViewport.matches) {
                return;
            }

            sidebar.classList.add("is-mobile-open");
            toggle.classList.add("is-active");
            backdrop.classList.add("is-visible");

            document.body.classList.add("mobile-nav-open");

            sidebar.setAttribute("aria-hidden", "false");
            sidebar.inert = false;

            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close navigation menu");

            backdrop.setAttribute("aria-hidden", "false");
            backdrop.tabIndex = 0;
        }

        function closeMenu(returnFocus) {

            sidebar.classList.remove("is-mobile-open");
            toggle.classList.remove("is-active");
            backdrop.classList.remove("is-visible");

            document.body.classList.remove("mobile-nav-open");

            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");

            backdrop.setAttribute("aria-hidden", "true");
            backdrop.tabIndex = -1;

            if (mobileViewport.matches) {
                sidebar.setAttribute("aria-hidden", "true");
                sidebar.inert = true;
            } else {
                sidebar.setAttribute("aria-hidden", "false");
                sidebar.inert = false;
            }

            if (returnFocus && mobileViewport.matches) {
                toggle.focus();
            }
        }

        function syncViewport() {

            if (mobileViewport.matches) {

                if (!sidebar.classList.contains("is-mobile-open")) {
                    sidebar.setAttribute("aria-hidden", "true");
                    sidebar.inert = true;
                }

            } else {

                closeMenu(false);

                sidebar.setAttribute("aria-hidden", "false");
                sidebar.inert = false;
            }
        }

        toggle.addEventListener("click", function () {

            if (sidebar.classList.contains("is-mobile-open")) {
                closeMenu(true);
            } else {
                openMenu();
            }
        });

        backdrop.addEventListener("click", function () {
            closeMenu(true);
        });

        sidebar.addEventListener("click", function (event) {

            const action = event.target.closest("a, #logoutButton");

            if (action) {
                closeMenu(false);
            }
        });

        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                sidebar.classList.contains("is-mobile-open")
            ) {
                closeMenu(true);
            }
        });

        if (typeof mobileViewport.addEventListener === "function") {
            mobileViewport.addEventListener("change", syncViewport);
        } else if (typeof mobileViewport.addListener === "function") {
            mobileViewport.addListener(syncViewport);
        }

        syncViewport();
    }

    /* ==========================================
       DASHBOARD MESSAGES
       ========================================== */

    function showMessage(message) {

        if (dashboardMessage) {
            dashboardMessage.textContent = message;
            dashboardMessage.hidden = false;
        }
    }

    /* ==========================================
       STUDENT AVATAR INITIAL
       ========================================== */

    function setStudentInitial(name) {

        const initial = name && name.trim()
            ? name.trim().charAt(0).toUpperCase()
            : "S";

        document.querySelectorAll(".sidebar .avatar, .account-avatar")
            .forEach(function (avatar) {
                avatar.textContent = initial;
            });
    }

    /* Initialize navigation before loading dashboard data */
    setupMobileNavigation();

    /* ==========================================
       LOAD DASHBOARD DATA
       ========================================== */

    try {

        const response = await fetch("/api/dashboard", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });

        /* Redirect expired sessions to login */
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

        const name =
            typeof data.fullName === "string" && data.fullName.trim()
                ? data.fullName.trim()
                : "Student";

        /* Student names */

        if (sidebarName) {
            sidebarName.textContent = name;
        }

        if (topbarName) {
            topbarName.textContent = name;
        }

        if (welcomeName) {
            welcomeName.textContent = name + "!";
        }

        setStudentInitial(name);

        /* Student information */

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