
document.addEventListener("DOMContentLoaded", function () {

    const statsSection = document.querySelector("#care");
    let hasAnimated = false;

    function animateValue(id, end, duration, suffix = "") {
        const obj = document.getElementById(id);
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;

            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * end);


            obj.textContent = value.toLocaleString() + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end.toLocaleString() + suffix;
            }
        }

        window.requestAnimationFrame(step);
    }

    function runStatsAnimation() {
        if (hasAnimated) return;

        const sectionPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (sectionPosition < screenPosition) {

            animateValue("statCustomers", 150, 500000, "+");
            animateValue("statSatisfaction", 98, 50000, "%");
            animateValue("statNatural", 100, 50000, "%");

            hasAnimated = true;
        }
    }

    window.addEventListener("scroll", runStatsAnimation);
    runStatsAnimation(); // run once on load

});
