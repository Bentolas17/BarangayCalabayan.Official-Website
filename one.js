document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".section");

    // 1. Smooth Scrolling for Navigation
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // 2. Active Link Highlight on Scroll
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
});