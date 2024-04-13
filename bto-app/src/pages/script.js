const handleScrollAnimation = () => {
  const revealElements = () => {
    const anim1Elements = document.querySelectorAll(".anim-1");
    if (!anim1Elements.length) {
      console.error("No elements with class .anim-1 found");
      return;
    }

    const anim2Elements = document.querySelectorAll(".anim-2");
    if (!anim2Elements.length) {
      console.error("No elements with class .anim-2 found");
      return;
    }

    const anim3Elements = document.querySelectorAll(".anim-3");
    if (!anim3Elements.length) {
      console.error("No elements with class .anim-3 found");
      return;
    }

    const logoElements = document.querySelectorAll(".logo-block");
    if (!logoElements.length) {
      console.error("No elements with class .logo-block found");
    }

    // const scrollPosition = window.scrollY + window.innerHeight;
    const scrollPosition = window.scrollY + window.innerHeight - 200;
    anim1Elements.forEach((element) => {
      const elementPosition = element.offsetTop;
      if (scrollPosition > elementPosition) {
        element.classList.add("animate");
      } else {
        element.classList.remove("animate");
      }
    });

    anim2Elements.forEach((element) => {
      const elementPosition = element.offsetTop;
      if (scrollPosition > elementPosition) {
        // console.log(scrollPosition)
        // console.log(elementPosition)
        element.classList.add("animate");
      } else {
        element.classList.remove("animate");
      }
    });

    anim3Elements.forEach((element) => {
      const elementPosition = element.offsetTop;
      if (scrollPosition > elementPosition) {
        // console.log(scrollPosition)
        // console.log(elementPosition)
        element.classList.add("animate");
      } else {
        element.classList.remove("animate");
      }
    });

    const scrollPositionForLogos = window.scrollY + window.innerHeight - 300;

    logoElements.forEach((element) => {
      // const elementPosition = element.offsetTop;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      if (scrollPositionForLogos > elementPosition) {
        // console.log(scrollPosition)
        // console.log(elementPosition)
        element.classList.add("animate");
      } else {
        element.classList.remove("animate");
      }
    });
  };

  // Call revealElements initially to reveal elements that are already in view
  revealElements();

  // Attach event listener to window scroll for dynamically revealing elements
  window.addEventListener("scroll", revealElements);
};

export default handleScrollAnimation;
