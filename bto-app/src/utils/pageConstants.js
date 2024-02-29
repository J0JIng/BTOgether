const entry = "Entry"
const login = "Login";
const faqsTabName = "FAQs";
const aboutUs = "About Us";
const home = "Home";

const pagesValueObj = {
  
  1: entry, 
  2: login,
  3: faqsTabName,
  4: aboutUs,
  5: home,

};

function spinalCase(str) {
  return (
    "/" +
    str
      .split(" ") //splits the string into pieces at spaces
      .map((c) => c.toLowerCase()) //makes each piece lowercase
      .join("-")
  ); //combines each piece with a "-"
}

const pagesLinkObj = {
  [entry]: spinalCase(entry),
  [login]: spinalCase(login),
  [faqsTabName]: spinalCase(faqsTabName),
  [aboutUs]: spinalCase(aboutUs),
  [home]: spinalCase(home),
};

export {
  entry,
  login,
  faqsTabName,
  aboutUs,
  pagesValueObj,
  pagesLinkObj,
  home,
  spinalCase,
};
