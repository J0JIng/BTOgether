const entry = "Entry";
const login = "Login";
const faqsTabName = "FAQs";
const aboutUs = "About Us";
const home = "Home";
const profile = "manage profile";
const dashboard = "dashboard";
const btofind = "bto find";
const btoplanner = "bto planner";

const pagesValueObj = {
  1: entry,
  2: login,
  3: faqsTabName,
  4: aboutUs,
  5: home,
  6: profile,
  7: dashboard,
  8: btofind,
  9: btoplanner,
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
  [profile]: spinalCase(profile),
  [dashboard]: spinalCase(dashboard),
  [btofind]: spinalCase(btofind),
  [btoplanner]: spinalCase(btoplanner),
};

export {
  entry,
  login,
  faqsTabName,
  aboutUs,
  pagesValueObj,
  pagesLinkObj,
  home,
  profile,
  dashboard,
  btofind,
  btoplanner,
  spinalCase,
};
