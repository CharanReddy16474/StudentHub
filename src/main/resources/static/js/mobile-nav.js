
/* StudentHub responsive mobile navigation.
   Loaded on dashboard.html and profile.html only. */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const sidebar = document.querySelector(".sidebar");
        const topbar = document.querySelector(".topbar");

        if (!sidebar || !topbar ||
            document.getElementById("mobileMenuToggle")) {
            return;
        }

        // Load the companion stylesheet if it isn't already linked.
        const hasMobileCss =
            Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                .some(function (link) {
                    return link.href.includes("/css/mobile-nav.css");
                });

        if (!hasMobileCss) {
            const mobileCss = document.createElement("link");
            mobileCss.rel = "stylesheet";
            mobileCss.href =
                "/css/mobile-nav.css?v=20261020-hamburger1";
            document.head.appendChild(mobileCss);
        }

        if (!sidebar.id) {
            sidebar.id = "studentHubSidebar";
        }

        sidebar.classList.add("mobile-drawer");
        sidebar.setAttribute("aria-label", "Student navigation");

        // Add the three-line hamburger before the page heading.
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.id = "mobileMenuToggle";
        toggle.className = "mobile-menu-toggle";
        toggle.setAttribute("aria-label", "Open navigation menu");
        toggle.setAttribute("aria-controls", sidebar.id);
        toggle.setAttribute("aria-expanded", "false");

        toggle.innerHTML = [
            '<span aria-hidden="true"></span>',
            '<span aria-hidden="true"></span>',
            '<span aria-hidden="true"></span>'
        ].join("");

        topbar.insertBefore(toggle, topbar.firstElementChild);

        // Add a dimmed backdrop behind the drawer.
        const backdrop = document.createElement("button");
        backdrop.type = "button";
        backdrop.className = "mobile-nav-backdrop";
        backdrop.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
        backdrop.setAttribute("aria-hidden", "true");
        backdrop.tabIndex = -1;

        document.body.appendChild(backdrop);

        const mobileViewport =
            window.matchMedia("(max-width: 760px)");

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
            toggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            backdrop.setAttribute("aria-hidden", "false");
            backdrop.tabIndex = 0;
        }

        function closeMenu(returnFocus) {
            sidebar.classList.remove("is-mobile-open");
            toggle.classList.remove("is-active");
            backdrop.classList.remove("is-visible");
            document.body.classList.remove("mobile-nav-open");

            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

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

        // Close the drawer before navigating or submitting logout.
        sidebar.addEventListener("click", function (event) {
            const navigationAction = event.target.closest("a");
            const logoutAction = event.target.closest("#logoutButton");

            if (navigationAction || logoutAction) {
                closeMenu(false);
            }
        });

        // Allow the Escape key to close the drawer.
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

        // On phones, display the full image as a real image above
        // the welcome text. The desktop background remains unchanged.
        const banner = document.querySelector(".welcome-banner");
        const welcomeCopy =
            banner ? banner.querySelector(".welcome-copy") : null;

        if (
            banner &&
            welcomeCopy &&
            !banner.querySelector(".mobile-welcome-image")
        ) {
            const image = document.createElement("img");
            image.className = "mobile-welcome-image";
            image.src = "/images/studenthub-welcome.png";
            image.alt = "StudentHub study space";
            image.loading = "eager";
            image.decoding = "async";

            banner.insertBefore(image, welcomeCopy);
        }

        syncViewport();
    });
})();
