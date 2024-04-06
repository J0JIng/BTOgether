const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    } else {
      entry.target.classList.remove("animate");
    }
  });
});

const anim1Elements = document.querySelectorAll(".anim-1");
anim1Elements.forEach((el) => observer.observe(el));

const anim2Elements = document.querySelectorAll(".anim-2");
anim2Elements.forEach((el) => observer.observe(el));
