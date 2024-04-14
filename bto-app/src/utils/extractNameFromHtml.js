// Function to parse HTML content and extract attribute values
export function extractNameFromHtml(htmlContent) {
  const tableRegex = /<(table|tr|th|td)\b[^>]*>/i;

  if (htmlContent?.popUp) {
    if (tableRegex.test(htmlContent.popUp) === true) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = htmlContent.popUp;
      const thElements = tempElement.querySelectorAll("th");
      let nameElement = null;
      thElements.forEach((th) => {
        if (
          th.textContent.trim() === "NAME" ||
          th.textContent.trim() === "CENTRE_NAME" ||
          th.textContent.trim() === "HCI_NAME"
        ) {
          nameElement = th;
        }
      });
      if (nameElement) {
        const tdElement = nameElement.nextElementSibling;
        if (tdElement) {
          return tdElement.textContent.trim();
        }
      }
      return ""; // Return an empty string if "NAME" is not found
    } else {
      return htmlContent.popUp;
    }
  } else if (htmlContent) {
    if (tableRegex.test(htmlContent) === true) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = htmlContent;
      const thElements = tempElement.querySelectorAll("th");
      let nameElement = null;
      thElements.forEach((th) => {
        if (
          th.textContent.trim() === "NAME" ||
          th.textContent.trim() === "CENTRE_NAME" ||
          th.textContent.trim() === "HCI_NAME"
        ) {
          nameElement = th;
        }
      });
      if (nameElement) {
        const tdElement = nameElement.nextElementSibling;
        if (tdElement) {
          return tdElement.textContent.trim();
        }
      }
      return ""; // Return an empty string if "NAME" is not found
    } else {
      return htmlContent;
    }
  } else {
    return "";
  }
}
