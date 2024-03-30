const handleScrollAnimation = () => {
    const revealElements = () => {
        const elements = document.querySelectorAll('.anim');
        if (!elements.length) {
            console.error('No elements with class .anim found');
            return;
        }

        const scrollPosition = window.scrollY + window.innerHeight;

        elements.forEach(element => {
            const elementPosition = element.offsetTop;
            if (scrollPosition > elementPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Call revealElements initially to reveal elements that are already in view
    revealElements();

    // Attach event listener to window scroll for dynamically revealing elements
    window.addEventListener('scroll', revealElements);
}

export default handleScrollAnimation;
