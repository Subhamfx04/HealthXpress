/* =====================================================
   Main Script | Healthcare Support Platform
   Author: Frontend Module
   Purpose: Centralized user navigation & access control
===================================================== */

(function ($, window, document) {
    "use strict";

    // Check if user is registered
    const isUserRegistered = () => {
        return localStorage.getItem('userId') !== null;
    };

    // Navigate to page or register if needed
    const navigateTo = (page) => {
        if (!isUserRegistered()) {
            window.location.href = 'register.html';
        } else {
            window.location.href = page;
        }
    };

    // Bind navigation events
    const bindNavigationEvents = () => {
        // Navbar links - navigate to actual pages if registered
        $(".nav-links").on("click", "a", function (e) {
            e.preventDefault();
            const href = $(this).attr("href");
            
            // Don't redirect "Home" if already on project.html
            if (href === "project.html" && window.location.pathname.includes("project.html")) {
                return;
            }
            
            navigateTo(href);
        });

        // Primary CTA button - Request Ambulance
        $("#registerBtn").on("click", function () {
            navigateTo('ambulance.html');
        });

        // Doctor Help Button
        $("#doctorHelpBtn").on("click", function () {
            navigateTo('doctor-choice.html');
        });

        // Service cards
        $(".services").on("click", ".card", function () {
            const href = $(this).attr("onclick");
            if (href) {
                const match = href.match(/href='([^']+)'/);
                if (match) {
                    navigateTo(match[1]);
                }
            }
        });

        // Logout button
        $("#logoutBtn").on("click", function (e) {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                window.location.href = 'project.html';
            }
        });
    };

    // Update navbar with user info if logged in
    const updateNavbar = () => {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        
        if (userId && userName) {
            // User is logged in - add logout button
            const logoutBtn = `<li style="float: right;"><a href="#" id="logoutBtn" style="background: #dc3545; padding: 10px 15px; border-radius: 4px;">👤 ${userName} (Logout)</a></li>`;
            $(".nav-links").append(logoutBtn);
        }
    };

    // Enhance UI
    const enhanceUI = () => {
        $(".card, .btn-primary, .nav-links a, .btn-priority")
            .attr("role", "button")
            .css("cursor", "pointer");
    };

    // Initialize
    const init = () => {
        updateNavbar();
        bindNavigationEvents();
        enhanceUI();
    };

    // DOM Ready
    $(document).ready(init);

})(jQuery, window, document);
