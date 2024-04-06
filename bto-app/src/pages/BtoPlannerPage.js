import Navbar from "../components/NavBar";
import "../css/plannertab.css";
import "../css/dashboard.css";
import React, { useEffect, useState } from "react";

const BtoPlannerPage = () => {
  useEffect(() => {
    // Function to save checkbox states to localStorage
    function saveCheckboxStates() {
      var checkboxes = document.querySelectorAll(".section-checkbox");
      checkboxes.forEach(function (checkbox, index) {
        localStorage.setItem(`checkbox${index}`, checkbox.checked);
      });
    }

    // Function to load checkbox states from localStorage
    function loadCheckboxStates() {
      var checkboxes = document.querySelectorAll(".section-checkbox");
      checkboxes.forEach(function (checkbox, index) {
        var isChecked = localStorage.getItem(`checkbox${index}`) === "true";
        checkbox.checked = isChecked;
      });
    }

    // Call loadCheckboxStates when the page loads
    loadCheckboxStates();

    // Call saveCheckboxStates when a checkbox state changes
    var checkboxes = document.querySelectorAll(".section-checkbox");
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        saveCheckboxStates(); // Update localStorage when checkbox status changes
      });
    });

    var acc = document.getElementsByClassName("accordion");

    for (var i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        // Toggle active class for the clicked accordion
        this.classList.toggle("active");

        // Toggle panel display for the clicked accordion
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "block";
        } else {
          panel.style.display = "block";
        }

        // Close previously opened accordion panels
        var siblings = this.parentElement.getElementsByClassName("accordion");
        for (var j = 0; j < siblings.length; j++) {
          if (siblings[j] !== this) {
            siblings[j].classList.remove("active");
            siblings[j].nextElementSibling.style.display = "none";
          }
        }
      });
    }

    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".panel");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        // Hide all panels
        panels.forEach(function (panel) {
          panel.style.display = "none";
        });

        // Remove active class from all accordions
        var accordions = document.querySelectorAll(".accordion");
        accordions.forEach(function (accordion) {
          accordion.classList.remove("active");
        });

        // Show the corresponding panel
        var panelId = this.dataset.panel;
        document.getElementById(panelId).style.display = "block";
      });
    });

    // Prevent accordion toggle when clicking on the checkbox
    var checkboxes = document.querySelectorAll(".section-checkbox");
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    });

    // Function to update the counters next to each header
    function updateCounters() {
      var panels = document.querySelectorAll(".panel");
      panels.forEach(function (panel) {
        var checkboxes = panel.querySelectorAll(".section-checkbox");
        var totalCheckboxes = checkboxes.length;
        var checkedCount = panel.querySelectorAll(
          ".section-checkbox:checked"
        ).length;
        var counter = panel.querySelector(".counter");
        if (counter) {
          counter.textContent = checkedCount + "/" + totalCheckboxes;
          if (checkedCount === totalCheckboxes) {
            counter.classList.add("all-checked"); // Add a class if all checkboxes are checked
          } else {
            counter.classList.remove("all-checked"); // Remove the class if not all checkboxes are checked
          }
        }
      });
    }

    // Call the function initially to set the initial count
    updateCounters();

    // Add event listener to each checkbox
    var checkboxes = document.querySelectorAll(".section-checkbox");
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        updateCounters(); // Update the counter when checkbox status changes
      });
    });

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        // Remove the 'bold' class from all tabs
        tabs.forEach(function (t) {
          t.classList.remove("bold");
        });
        // Add the 'bold' class to the clicked tab
        this.classList.add("bold");

        // Hide all panels with animation
        panels.forEach(function (panel) {
          panel.classList.remove("show"); // Remove 'show' class
        });

        // Show the corresponding panel with animation
        var panelId = this.dataset.panel;
        var panelToShow = document.getElementById(panelId);
        panelToShow.classList.add("show"); // Add 'show' class to animate
      });
    });
  }, []); // Empty dependency array to run the effect only once after initial render

  return (
    <div className="bto-planner-page">
      <Navbar />
      <h1 className="planner-heading">Planner</h1>
      <div className="left-sidebar">
        <div className="category">
          <ul>
            <li className="tab" data-panel="panel1">
              Pre-Acquisition Phase
            </li>
            <li className="tab" data-panel="panel2">
              Application Process
            </li>
            <li className="tab" data-panel="panel3">
              Financial Planning & Grants
            </li>
            <li className="tab" data-panel="panel4">
              Flat Selection & Allocation
            </li>
            <li className="tab" data-panel="panel5">
              Key Collection & Move-In Process
            </li>
            <li className="tab" data-panel="panel6">
              Renovation & Interior Design
            </li>
            <li className="tab" data-panel="panel7">
              Post-Acquisition Maintenance
            </li>
            <li className="tab" data-panel="panel8">
              Resale & Upgrading Options
            </li>
          </ul>
        </div>
      </div>
      <div className="panel" id="panel1">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "-35px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Pre-Acquisition Phase <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What documents and information do I need to prepare before applying
          for a BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Before applying for a BTO flat, it's crucial to gather all necessary
            documents and information to ensure a smooth application process.
            You'll typically need your National Registration Identity Card
            (NRIC) or passport, income statements (such as payslips or CPF
            contribution history), marriage certificates (if applying under the
            Married Child Priority Scheme or with your spouse), and any relevant
            HDB forms. Additionally, having a clear understanding of your
            financial situation, including savings, existing debts, and monthly
            expenses, will help you determine your affordability and budget for
            the BTO flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/booking-of-flat/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.homeanddecor.com.sg/property-tips/how-to-apply-hdb-bto-first-time-homeowners-step-by-step/">
              {" "}
              Home&Decor{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          How can I estimate my budget and affordability for a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            Estimating your budget and affordability for a BTO flat is a crucial
            step in the pre-acquisition phase. You can use online calculators
            provided by the Housing and Development Board (HDB) to estimate your
            maximum loan quantum and monthly mortgage payments based on your
            income, savings, and existing financial commitments. These
            calculators take into account factors such as the prevailing
            interest rates, loan tenure, and down payment requirements. It's
            essential to be realistic about your financial capabilities and
            ensure that you can comfortably afford the monthly mortgage payments
            without overstretching your budget.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/working-out-your-flat-budget/budget-for-flat/">
              {" "}
              HDB - Working Out Your Budget
            </a>
          </p>
          <p>
            {" "}
            2.{" "}
            <a href="https://homes.hdb.gov.sg/home/calculator/budget/">
              {" "}
              HDB - Budget Calculator{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          Can singles apply for a BTO flat? What are the options available to
          them? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            Yes, singles can apply for BTO flats under the Single Singapore
            Citizen (SSC) scheme, which caters specifically to single citizens
            aged 35 and above. Under this scheme, singles have the option to
            choose from 2-room Flexi flats or Studio Apartments, depending on
            their preferences and needs. The 2-room Flexi flats come in various
            lease lengths, ranging from 45 to 99 years, allowing singles greater
            flexibility in selecting the lease duration that best suits their
            financial situation and future plans.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/singles/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            {" "}
            2.{" "}
            <a href="https://www.dbs.com.sg/personal/articles/nav/my-home/the-single-guide-to-buying-a-HDB-flat-in-singapore#:~:text=From%202H2024%2C%20with%20the%20new,flat%20in%20the%20resale%20market/">
              {" "}
              DBS{" "}
            </a>
          </p>
          <p>
            {" "}
            3.{" "}
            <a href="https://www.moneysmart.sg/home-loan/housing-guide-for-singles-ms/">
              {" "}
              MoneySmart{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          Is it possible to apply for a BTO flat with someone who is not a
          family member? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            Yes, it is possible to apply for a BTO flat with someone who is not
            a family member through the Joint Singles Scheme (JSS). The JSS
            allows two single citizens aged 35 and above to jointly purchase a
            BTO flat, regardless of their relationship or gender. Both
            applicants must meet the eligibility criteria, including citizenship
            status, age, and income requirements. Applying under the JSS
            provides singles with the opportunity to co-own a home and share the
            financial responsibilities associated with homeownership.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1.{" "}
            <a href="https://www.income.com.sg/blog/guide-to-bto-for-newbies#:~:text=You%20will%20only%20be%20able,and%20control%20of%20your%20child/">
              {" "}
              Income{" "}
            </a>
          </p>
          <p>
            {" "}
            2.{" "}
            <a href="https://www.hdb.gov.sg/cs/infoweb/residential/renting-a-flat/renting-from-hdb/public-rental-scheme/eligibility/joint-singles-scheme-operator-run-pilot/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          How can I find out about upcoming BTO launches and their locations?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            Staying informed about upcoming BTO launches and their locations is
            essential for prospective buyers planning to apply for a BTO flat.
            The Housing and Development Board (HDB) regularly announces upcoming
            BTO launches on their official website and through other
            communication channels, such as social media platforms and press
            releases. Additionally, interested applicants can subscribe to HDB's
            eAlert service to receive notifications about upcoming BTO launches
            via email or SMS. By staying updated on upcoming launches and their
            locations, prospective buyers can plan their application strategy
            and make informed decisions about their housing options.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1. <a href="https://homes.hdb.gov.sg/home/landing/"> HDB </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          Are there any priority schemes available for certain groups of
          applicants? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            Yes, the Housing and Development Board (HDB) offers priority schemes
            to certain groups of applicants to facilitate their access to BTO
            flats. These priority schemes aim to cater to specific needs and
            circumstances, providing eligible applicants with priority
            allocation for BTO flats in their preferred locations. Some of the
            priority schemes include the Married Child Priority Scheme (MCPS),
            Multi-Generation Priority Scheme (MGPS), and Senior Priority Scheme
            (SPS). Eligibility criteria and benefits vary for each scheme, so
            it's essential to check the specific requirements and conditions
            before applying.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/application/priority-schemes#:~:text=First%20priority%20under%20the%20Family,Parenthood%20Priority%20Scheme%20(FPPS)./">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            {" "}
            2.{" "}
            <a href="https://www.99.co/singapore/insider/in-depth-guide-hdb-priority-schemes/">
              {" "}
              99.co{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          What factors should I consider when choosing the type and size of the
          BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            When choosing the type and size of a BTO flat, it's essential to
            consider various factors to ensure that it meets your current and
            future needs. Factors to consider include your household size,
            lifestyle preferences, budget, and long-term plans. Larger families
            may opt for 4-room or 5-room flats to accommodate their space
            requirements, while singles or couples may prefer smaller units such
            as 2-room Flexi or 3-room flats. Additionally, consider factors such
            as the layout, orientation, and proximity to amenities when
            selecting a BTO flat. By carefully evaluating these factors, you can
            choose a BTO flat that aligns with your lifestyle and preferences.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1.{" "}
            <a href="https://www.yp.sg/a-beginners-guide-on-how-to-select-an-ideal-and-huat-bto-unit/">
              {" "}
              YP.sg{" "}
            </a>
          </p>
          <p>
            {" "}
            2.{" "}
            <a href="https://elpisinterior.com.sg/4-room-bto-size-crash-course/#:~:text=It's%20important%20to%20consider%20your,home%20especially%20for%20young%20couples./">
              {" "}
              ELPSInterior{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {" "}
          How can I prepare myself emotionally and financially for the BTO
          application process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            {" "}
            The BTO application process can be both emotionally and financially
            challenging, requiring careful planning and preparation to ensure a
            successful outcome. Emotionally, it's essential to manage your
            expectations and be prepared for the possibility of facing rejection
            or delays during the application process. Understand that securing a
            BTO flat may take time and patience, and it's essential to stay
            resilient and optimistic throughout the journey. Financially, ensure
            that you have sufficient savings to cover the initial downpayment,
            as well as additional costs such as renovation and furnishing
            expenses. It's also advisable to review your budget and financial
            commitments to ensure that you can comfortably afford the monthly
            mortgage payments without overstretching your finances. By preparing
            yourself emotionally and financially, you can navigate the BTO
            application process with confidence and peace of mind.{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            {" "}
            1.{" "}
            <a href="https://www.singsaver.com.sg/blog/hdb-flat-selection/">
              {" "}
              SingSaver{" "}
            </a>
          </p>
          <p>
            {" "}
            2.{" "}
            <a href="https://www.aia.com.sg/en/health-wellness/healthy-living-with-aia/guide-to-planning-your-finances-for-first-time-home-buyers/">
              {" "}
              AIA{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel2">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "105px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Application Process <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How do I apply for a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Applying for a BTO flat involves several steps. Firstly, you need to
            log in to your HDB account on the official HDB website during the
            designated application period for the specific BTO project you're
            interested in. Then, you'll need to select your preferred flat type
            and location, providing all necessary details accurately. Make sure
            to review your application before submitting it and pay the
            application fee to confirm your submission. Keep in mind that each
            applicant can only submit one application per BTO exercise.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/application/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/buy-your-flat/your-guide-to-buying-a-bto-flat/">
              {" "}
              MyNiceHome{" "}
            </a>
          </p>
          <p>
            3.{" "}
            <a href="https://dollarsandsense.sg/bto-application-edition-step-step-guide-buying-hdb-bto-flat/">
              {" "}
              Dollars&Sense{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I apply for more than one BTO project at a time?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, applicants can apply for multiple BTO projects during their
            respective application periods. However, if an applicant is
            successful in more than one application, they will need to select
            only one flat. The other successful applications will be
            automatically voided, and the application fees refunded. It's
            essential to prioritize preferences and locations when applying for
            multiple projects simultaneously.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/modes-of-sale/faqs-for-sales-launch#:~:text=No.,exercise%2C%20and%20not%20both%20exercises./">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://seedly.sg/posts/if-i-already-have-a-hdb-bto-queue-number-can-i-apply-for-a-flat-in-another-sales-launch/">
              {" "}
              Seedly{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How are BTO flats allocated after the application period closes?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            BTO flats are allocated through a computerized balloting system
            after the application period closes. Each applicant is assigned a
            queue number, and flats are allocated based on random selection.
            Applicants who are successful will be notified via email and SMS,
            receiving an Invitation to Select (ITS) to proceed with the flat
            selection process.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://dollarbackmortgage.com/blog/secure-bto-ballot-tips/#:~:text=Balloting%3A%20After%20the%20application%20period,chance%20of%20securing%20a%20flat./">
              {" "}
              DollarBackMortgage{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.hdb.gov.sg/about-us/news-and-publications/publications/hdbspeaks/balloting-process-for-buildtoorder-bto-flats/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What happens if my application is successful?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, singles can apply for BTO flats under the Single Singapore
            Citizen (SSC) scheme, which caters specifically to single citizens
            aged 35 and above. Under this scheme, singles have the option to
            choose from 2-room Flexi flats or Studio Apartments, depending on
            their preferences and needs. The 2-room Flexi flats come in various
            lease lengths, ranging from 45 to 99 years, allowing singles greater
            flexibility in selecting the lease duration that best suits their
            financial situation and future plans.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/application/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.income.com.sg/blog/guide-to-bto-for-newbies#:~:text=Eligible%20buyers%20may%20apply%20for,how%20to%20apply%20for%20one./">
              {" "}
              Income{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What happens if my application is unsuccessful?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If your application is unsuccessful, you'll be notified via email
            and SMS. While it can be disappointing, unsuccessful applicants have
            the option to participate in future BTO launches or explore other
            housing options such as resale flats or executive condominiums
            (ECs).
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://dollarbackmortgage.com/blog/secure-bto-ballot-tips/#:~:text=If%20you%20have%20applied%20for,in%20a%20non%2Dmature%20estate./">
              {" "}
              DollarBackMortgage{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.propertyguru.com.sg/property-guides/hdb-bto-ballot-chances-priority-schemes-31048/">
              {" "}
              PropertyGuru{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I transfer my application to another BTO project after submitting
          it? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            No, it's not possible to transfer your application from one BTO
            project to another after submitting it. However, you can withdraw
            your application and reapply for a different BTO project during its
            respective application period if desired.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://seedly.sg/posts/if-i-already-have-a-hdb-bto-queue-number-can-i-apply-for-a-flat-in-another-sales-launch/">
              {" "}
              Seedly{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Are there any additional documents or requirements I need to fulfill
          after my application is successful?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, after your application is successful, you'll need to fulfill
            additional requirements. This may include attending a flat selection
            appointment, where you'll be required to bring along necessary
            documents such as your NRIC, marriage certificate (if applicable),
            and income documents. You'll also need to arrange for the payment of
            the downpayment and other fees as instructed by HDB.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/modes-of-sale/faqs-for-sales-launch/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://dollarsandsense.sg/bto-application-edition-step-step-guide-buying-hdb-bto-flat/">
              {" "}
              Dollars&Sense{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I change my selected flat after the flat selection appointment?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            No, it's not possible to change your selected flat after the flat
            selection appointment. Once you've confirmed your choice and signed
            the necessary documents, the selection is final. Therefore, it's
            essential to carefully consider your options before making a
            decision.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/renting-a-flat/renting-from-hdb/public-rental-scheme/changes-and-cancellation/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What should I do if I encounter issues or have questions during the
          application process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you encounter issues or have questions during the application
            process, don't hesitate to seek assistance. You can contact the HDB
            hotline or visit one of their branches for personalized assistance
            from housing officers. Additionally, you can consult online
            resources, forums, or seek advice from housing agents. Addressing
            any concerns promptly can help ensure a smooth application process
            and alleviate any uncertainties.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://homes.hdb.gov.sg/home/frequently-asked-questions/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel3">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "255px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Financial Planning & Grants <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What financial considerations should I keep in mind before applying
          for a BTO? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Before applying for a BTO, it's crucial to assess your financial
            situation thoroughly. Consider factors such as your savings, monthly
            income, existing debts, and other financial commitments. Determine
            how much you can afford to allocate towards the downpayment, monthly
            mortgage payments, and other expenses associated with homeownership.
            It's essential to budget wisely and ensure that you can comfortably
            manage the financial responsibilities of owning a home.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/singles/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.dbs.com.sg/personal/articles/nav/my-home/the-single-guide-to-buying-a-HDB-flat-in-singapore#:~:text=From%202H2024%2C%20with%20the%20new,flat%20in%20the%20resale%20market/">
              {" "}
              DBS{" "}
            </a>
          </p>
          <p>
            3.{" "}
            <a href="https://www.moneysmart.sg/home-loan/housing-guide-for-singles-ms/">
              {" "}
              MoneySmart{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are some common sources of funding for purchasing a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Common sources of funding for purchasing a BTO flat include savings,
            Central Provident Fund (CPF) savings, housing loans from financial
            institutions, and government grants. Many buyers utilize their CPF
            savings for the downpayment and monthly mortgage payments, while
            housing loans can cover the remaining cost of the flat. Government
            grants, such as the Additional CPF Housing Grant (AHG) and Special
            CPF Housing Grant (SHG), can also provide financial assistance to
            eligible buyers.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.cpf.gov.sg/member/infohub/educational-resources/essential-budgeting-tips-for-your-bto/">
              {" "}
              CPF{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://endowus.com/insights/planning-finances-hdb-bto/">
              {" "}
              Endowus{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I maximise the use of my CPF savings for purchasing a BTO
          flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To maximise the use of your CPF savings for purchasing a BTO flat,
            consider contributing regularly to your CPF Ordinary Account (OA)
            and Special Account (SA). These savings can be used to pay for the
            downpayment, monthly mortgage payments, and other housing-related
            expenses. Additionally, explore options such as the CPF Housing
            Grant and CPF Housing Withdrawal Limits to optimise the use of your
            CPF savings.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.cpf.gov.sg/member/faq/home-ownership/housing-scheme/how-much-cpf-savings-can-i-use-for-my-property-purchase/">
              {" "}
              CPF{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are the eligibility criteria for government grants when
          purchasing a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Eligibility criteria for government grants vary depending on the
            specific grant. However, common eligibility requirements include
            citizenship status, income ceiling, type of flat chosen, and whether
            it's the first-time purchase of a flat. For example, the Additional
            CPF Housing Grant (AHG) and Special CPF Housing Grant (SHG) are
            available to first-timers with specific income levels and flat
            types.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.madeforfamilies.gov.sg/support-measures/your-home-matters-new/housing-schemes-and-grants#:~:text=You%20can%20apply%20for%20the,prior%20to%20the%20flat%20application./">
              {" "}
              MadeForFamilies{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How do I apply for government grants when purchasing a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To apply for government grants when purchasing a BTO flat, you'll
            need to indicate your eligibility during the BTO application
            process. If you meet the eligibility criteria, the grants will be
            automatically included in your flat application. However, additional
            documentation or verification may be required to confirm eligibility
            for certain grants, so ensure that you provide accurate information
            during the application process.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.99.co/singapore/insider/hdb-grants-for-couples/">
              {" "}
              99.co{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can government grants be used to cover renovation costs for my BTO
          flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Government grants such as the Additional CPF Housing Grant (AHG) and
            Special CPF Housing Grant (SHG) are intended to assist with the
            purchase of a BTO flat and may not be used for renovation costs.
            However, eligible buyers can use their CPF savings or other sources
            of funding to cover renovation expenses.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.cpf.gov.sg/member/faq/home-ownership/housing-scheme/can-i-use-my-cpf-savings-for-renovation-and-repairs-of-my-proper/">
              {" "}
              CPF{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I ensure that I'm making informed financial decisions when
          purchasing a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To make informed financial decisions when purchasing a BTO flat,
            it's essential to conduct thorough research and seek advice from
            financial experts. Consider factors such as your budget,
            affordability, potential loan quantum, and eligibility for
            government grants. Review your financial goals and assess how
            homeownership fits into your long-term financial plan. Additionally,
            utilize online tools, calculators, and resources provided by HDB and
            financial institutions to help you make informed decisions.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/timeline/plan-your-finances/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I plan for the long-term financial implications of owning a
          BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Planning for the long-term financial implications of owning a BTO
            flat involves careful budgeting and foresight. Consider factors such
            as potential changes in income, interest rates, and housing-related
            expenses over time. Build a financial buffer for unexpected costs,
            such as maintenance and repairs, and explore options for maximizing
            your CPF savings and investment opportunities. It's also advisable
            to review your financial plan periodically and make adjustments as
            needed to ensure long-term financial stability.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/timeline/plan-your-finances/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://endowus.com/insights/planning-finances-hdb-bto/">
              {" "}
              Endowus{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel4">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "405px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Flat Selection & Allocation <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What factors should I consider when selecting a BTO flat during the
          flat selection process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            When selecting a BTO flat, consider factors such as the flat's
            layout, orientation, floor level, proximity to amenities, and future
            developments in the area. Assess your lifestyle preferences, space
            requirements, and long-term plans to choose a flat that meets your
            needs and preferences. Additionally, review the Sale of Balance
            Flats (SBF) options available during the selection process to
            explore alternative choices.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1. <a href="https://www.btohq.com/bto-selection-guide/"> BTOHQ </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.99.co/singapore/insider/selecting-bto-unit/">
              {" "}
              99.co{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I view the BTO flats in person before making my selection?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you can view the BTO flats in person before making your
            selection. HDB typically organizes flat viewing sessions for
            successful applicants, allowing them to visit the actual units and
            inspect the layout, fittings, and finishes. It's advisable to take
            advantage of these viewing sessions to make an informed decision
            about your preferred flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://seedly.sg/posts/is-it-possible-to-see-available-units-before-selecting-bto-unit/">
              {" "}
              Seedly{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What happens if I'm unable to attend the flat selection appointment?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you're unable to attend the flat selection appointment, you can
            authorize a proxy to attend on your behalf. Ensure that your proxy
            brings along all necessary documents and follows the procedures
            outlined by HDB. Alternatively, you can request to reschedule the
            appointment, although this may be subject to availability and
            approval by HDB.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/booking-of-flat/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.lemon8-app.com/curiousonlooker/7197327734614295042?region=sg/">
              {" "}
              Lemon8{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I request changes or modifications to the flat layout or fittings
          during the selection process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            No, it's generally not possible to request changes or modifications
            to the flat layout or fittings during the selection process for BTO
            flats. The units are constructed according to standard
            specifications and layouts predetermined by HDB. However, you may
            have the option to select from different finishings packages offered
            by HDB, allowing some customization within pre-defined options.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/renovate-your-flat/top-questions-hdb-home-owners-ask-when-renovating-their-bto-flat/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How are BTO flats allocated to applicants during the flat selection
          process? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            BTO flats are allocated to applicants during the flat selection
            process based on their queue number and the availability of units.
            Applicants with lower queue numbers have priority in selecting their
            preferred units. If your preferred unit is no longer available, you
            may choose from the remaining units based on the order of your queue
            number.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/application#:~:text=Your%20flat%20application%20will%20be,after%20your%20flat%20booking%20appointment./">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.propertyguru.com.sg/property-guides/hdb-bto-ballot-chances-priority-schemes-31048/">
              {" "}
              PropertyGuru{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What should I do if I'm undecided about which BTO flat to choose
          during the selection process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you're undecided about which BTO flat to choose during the
            selection process, take the time to carefully consider your options.
            Evaluate factors such as the flat's location, layout, orientation,
            and proximity to amenities. Discuss your preferences with family
            members or trusted advisors to gain additional insights. If
            necessary, seek guidance from HDB officers or housing agents to help
            you make an informed decision.
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I change my selected flat after confirming my choice during the
          selection process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Generally, you cannot change your selected flat after confirming
            your choice during the selection process. Once you've made your
            selection and signed the necessary documents, the decision is final.
            Therefore, it's crucial to thoroughly review your options and
            consider all relevant factors before confirming your choice.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/renting-a-flat/renting-from-hdb/public-rental-scheme/changes-and-cancellation/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What happens if I miss the deadline to select my BTO flat after
          receiving the Invitation to Select (ITS)?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you miss the deadline to select your BTO flat after receiving the
            Invitation to Select (ITS), your application may be considered as
            lapsed, and the flat may be offered to other applicants on the
            waiting list. It's essential to adhere to the specified timeline and
            follow the instructions provided by HDB to avoid missing the
            deadline.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.businesstimes.com.sg/property/choose-or-lose-your-bto-spot-hdb-tightens-rules-flat-selection#:~:text=From%20August%202023%20onwards%2C%20first,%2DFlats%20(SBF)%20programme./">
              {" "}
              BusinessTimes{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I appeal for a specific BTO flat if it's not available during the
          selection process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            No, it's generally not possible to appeal for a specific BTO flat if
            it's not available during the selection process. The availability of
            units is subject to demand and allocation based on queue numbers. If
            your preferred unit is not available, you may choose from the
            remaining units based on the order of your queue number or consider
            alternative options in future BTO launches.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.singsaver.com.sg/blog/lesser-known-things-to-be-aware-of-before-buying-a-hdb-bto-flat/">
              {" "}
              SingSaver{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What should I do if I encounter issues or have questions during the
          flat selection process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you encounter issues or have questions during the flat selection
            process, don't hesitate to seek assistance from HDB officers or
            housing agents. They can provide guidance and address any concerns
            you may have. Additionally, ensure that you understand the
            procedures and requirements outlined by HDB for the flat selection
            process to facilitate a smooth and successful outcome.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://homes.hdb.gov.sg/home/frequently-asked-questions/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel5">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "555px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Key Collection & Move-In Process <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What is the key collection process for a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            The key collection process for a BTO flat typically involves
            attending an appointment scheduled by the Housing and Development
            Board (HDB) to receive the keys to your new home. During the
            appointment, you'll need to bring along all necessary documents,
            such as your identification, proof of eligibility, and any
            outstanding payments. An HDB officer will guide you through the key
            collection process and provide relevant information about your flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://numberoneproperty.com/hdb-key-collection/#:~:text=On%20your%20key%20collection%20appointment,Fire%20Insurance%20Certificate%20of%20Insurance./">
              {" "}
              NumberOneProperty{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/move-into-your-flat/collecting-the-keys-to-your-hdb-flat/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How long does it take from the key collection to being able to move
          into the BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            The time it takes to move into your BTO flat after key collection
            can vary. In some cases, you may be able to move in immediately,
            while in others, you may need to wait for certain administrative
            procedures to be completed. Generally, it's advisable to start
            planning your move-in logistics well in advance to ensure a smooth
            transition.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/key-collection/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I inspect the BTO flat before accepting the keys during the key
          collection appointment?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you have the opportunity to inspect the BTO flat before
            accepting the keys during the key collection appointment. Take this
            chance to carefully inspect the unit for any defects or issues and
            note them down. You can then raise any concerns with the HDB officer
            present, who will assist you in addressing them through the defect
            rectification process.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/move-into-your-flat/collecting-the-keys-to-your-hdb-flat/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What should I do if I discover defects in my BTO flat during the
          inspection? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you discover defects in your BTO flat during the inspection, you
            should document them thoroughly and notify the HDB officer present
            immediately. The defects will be recorded, and arrangements will be
            made for the necessary rectification works. Be sure to keep a copy
            of the defect list for your records and follow up with HDB if needed
            to ensure timely resolution.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://qanvast.com/sg/articles/how-to-inspect-your-new-hdb-flat-and-rectify-any-defects-2390/">
              {" "}
              Qanvast{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/move-into-your-flat/a-guide-to-defects-inspection-for-your-new-hdb-bto-flat/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Are there any additional payments required during the key collection
          appointment? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Depending on your flat's payment schedule, there may be additional
            payments required during the key collection appointment. These
            payments could include the balance of the purchase price, stamp
            duty, legal fees, and any outstanding amounts for optional items
            such as car park lots or upgrading features. It's essential to have
            sufficient funds prepared beforehand to facilitate a smooth key
            collection process.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/key-collection#:~:text=Stamp%20duty%20and%20legal%20fees,on%20the%20Deed%20of%20Assignment./">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I authorise someone else to collect the keys on my behalf if I'm
          unable to attend the appointment?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you can authorise someone else to collect the keys on your
            behalf if you're unable to attend the appointment. You'll need to
            provide a letter of authorisation along with the necessary
            identification documents for both yourself and the authorised
            person. Ensure that your representative is fully briefed on the key
            collection procedures and any outstanding matters related to the
            flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/buying-procedure-for-new-flats/key-collection#:~:text=Power%20of%20Attorney%20(POA),or%20collect%20the%20keys%20personally.&text=A%20Power%20of%20Attorney%20(POA,matters%20specified%20in%20the%20POA./">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I make modifications or renovations to my BTO flat after key
          collection? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you can make modifications or renovations to your BTO flat
            after key collection, subject to certain guidelines and approvals.
            Before making any changes, you'll need to obtain the necessary
            permits and approvals from relevant authorities, such as HDB or the
            Building and Construction Authority (BCA). Ensure that any
            modifications comply with building regulations and do not affect the
            structural integrity or safety of the flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://qanvast.com/sg/articles/bto-101-what-to-do-after-key-collection-1803">
              {" "}
              Qanvast{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are some essential tasks to complete after key collection before
          moving into the BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            After key collection, there are several essential tasks to complete
            before moving into your BTO flat. These include setting up utilities
            such as water, electricity, and gas services, arranging for home
            insurance coverage, and conducting a final inspection to ensure that
            any defects have been rectified satisfactorily. Additionally, plan
            your move-in logistics and schedule any necessary deliveries or
            installations to coincide with your move-in date.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://mrd.com.sg/hdb-key-collection/#:~:text=Inspect%20your%20new%20HDB%2FBTO&text=Check%20for%20faulty%20starters%20and,hinges%20to%20ensure%20they%20work./">
              {" "}
              MRD{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I ensure a smooth transition during the move-in process?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To ensure a smooth transition during the move-in process, create a
            checklist of tasks to complete before and after moving in. This may
            include cleaning the flat, unpacking boxes, assembling furniture,
            and organising belongings. Coordinate with movers or family members
            to assist with the move, and designate specific areas for unpacking
            and storage. Keep important documents and valuables secure during
            the move and have a plan in place for handling any unexpected issues
            that may arise.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.homeanddecor.com.sg/design/home-tips/steps-to-take-before-during-and-after-moving-house-for-a-smooth-transition-into-your-new-home/">
              {" "}
              HomeAndDecor{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are some essential tasks to complete shortly after moving into
          the BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Shortly after moving into the BTO flat, prioritize tasks such as
            updating your address with relevant authorities and service
            providers, registering for Community Club membership, and
            familiarising yourself with emergency procedures and facilities in
            the neighborhood. Set up a maintenance schedule for regular cleaning
            and upkeep of the flat. Additionally, explore nearby amenities and
            services such as schools, healthcare facilities, and recreational
            areas to optimise your living experience.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.singsaver.com.sg/blog/essentials-to-buy-before-moving-to-new-hdb-flat/">
              {" "}
              SingSaver{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel6">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "705px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Renovation & Interior Design <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are the guidelines and regulations for renovating a BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            HDB has specific guidelines and regulations in place for renovating
            a BTO flat to ensure safety, structural integrity, and harmony
            within the estate. These guidelines cover aspects such as structural
            alterations, electrical and plumbing works, and the use of approved
            building materials. It's essential to familiarize yourself with
            these guidelines and obtain the necessary permits and approvals from
            HDB before commencing any renovation works.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/renovation/guidelines/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I engage any renovation contractor or interior designer for my BTO
          flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you can engage any renovation contractor or interior designer
            for your BTO flat, provided they are registered under the HDB
            Registered Renovation Contractor Scheme or HDB Registered Renovation
            Contractor Scheme (Design for Safety). These schemes ensure that
            contractors and designers meet certain standards of professionalism,
            competency, and accountability. It's advisable to research and
            engage reputable professionals with relevant experience in BTO
            renovations.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/interior-designer-contractor-or-home-stylist/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are some popular interior design styles for BTO flats?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Popular interior design styles for BTO flats include modern
            minimalist, Scandinavian, industrial, and contemporary. Each style
            offers a distinct aesthetic and can be tailored to suit different
            preferences and lifestyles. Consider factors such as space
            constraints, natural lighting, and personal preferences when
            choosing an interior design style for your BTO flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://qanvast.com/sg/articles/design-ideas-for-every-hdb-bto-layout-from-2345-room-to-3gen-flats-2965/">
              {" "}
              Qanvast{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I maximise space and optimise storage in my BTO flat through
          interior design?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Maximising space and optimising storage in a BTO flat can be
            achieved through strategic interior design solutions. Consider
            built-in storage solutions such as custom cabinets, multipurpose
            furniture with hidden storage compartments, and modular shelving
            units. Utilise vertical space effectively and minimise clutter to
            create a sense of openness and functionality in the living area.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://9creation.com.sg/bto-interior-design-tips/#:~:text=2)%20How%20can%20I%20make,floor%20space%20clear%20and%20organized./">
              {" "}
              9creation{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.homeguide.com.sg/interior-design-ideas-to-maximise-space-in-a-two-room-bto/">
              {" "}
              Homeguide{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What should I consider when selecting materials and finishes for my
          BTO flat renovation?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            When selecting materials and finishes for your BTO flat renovation,
            consider factors such as durability, maintenance requirements, and
            aesthetic appeal. Opt for high-quality materials that are suitable
            for the specific areas of the flat, such as moisture-resistant tiles
            for bathrooms and kitchens. Choose finishes that complement your
            chosen interior design style and reflect your personal taste while
            remaining practical for everyday use.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://megafurniture.sg/blogs/articles/right-materials-for-your-hdb-renovation/">
              {" "}
              Megafurniture{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I make structural alterations or additions to my BTO flat during
          renovation? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you can make structural alterations or additions to your BTO
            flat during renovation, subject to approval from HDB and compliance
            with building regulations. Examples of structural alterations
            include combining or partitioning rooms, changing the layout of
            walls, and installing additional windows or doors. It's essential to
            engage a qualified professional and obtain the necessary permits and
            approvals before proceeding with any structural works.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/business/commercial/managing-your-unit/renovation/addition-and-alteration-works/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I ensure that my renovation project stays within budget and
          timeline? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To ensure that your renovation project stays within budget and
            timeline, start by establishing a realistic budget and prioritizing
            essential features and upgrades. Obtain detailed quotations from
            multiple contractors and compare costs and timelines before making a
            decision. Communicate clearly with your contractor or designer about
            your budget constraints and timeline expectations. Regularly monitor
            the progress of the project and address any issues or delays
            promptly to prevent cost overruns and schedule disruptions.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://9creation.com.sg/how-to-make-sure-your-renovation-is-on-track/">
              {" "}
              9creation{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I incorporate smart home technology into my BTO flat
          renovation? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Incorporating smart home technology into your BTO flat renovation
            can enhance convenience, comfort, and energy efficiency. Install
            smart home devices such as smart lighting systems, thermostats,
            security cameras, and automated window treatments that can be
            controlled remotely via smartphone apps or voice commands. Consider
            integrating these devices into a centralized smart home hub for
            seamless connectivity and control.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://prdt.com.sg/transform-your-singapore-bto-with-inspiring-renovation-and-design-ideas/#:~:text=Install%20smart%20lighting%20systems%2C%20automated,or%20through%20a%20mobile%20app.">
              {" "}
              PRDT{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://homesmart.sg/guide-to-creating-a-smart-home/">
              {" "}
              HomeSmart{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel7">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "855px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Post-Acquisition Maintenance <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How often should I conduct routine maintenance checks for my BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            It's advisable to conduct routine maintenance checks for your BTO
            flat at least once every few months. Schedule inspections to assess
            the condition of various components such as plumbing fixtures,
            electrical systems, appliances, and structural elements. Promptly
            address any issues or abnormalities to maintain the functionality
            and safety of your flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/maintain-your-flat/a-guide-to-maintaining-your-hdb-flat/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are some common maintenance tasks that homeowners should perform
          regularly? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Common maintenance tasks that homeowners should perform regularly
            include cleaning and unclogging drains, testing smoke detectors and
            carbon monoxide alarms, checking for leaks or water damage,
            inspecting electrical outlets and switches, and servicing air
            conditioning units. Additionally, inspect windows and doors for
            proper operation and weather sealing, and maintain exterior surfaces
            such as walls and balconies.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.mynicehome.gov.sg/hdb-how-to/maintain-your-flat/a-guide-to-maintaining-your-hdb-flat/">
              {" "}
              MyNiceHome.gov{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I effectively manage and organise maintenance records for my
          BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To effectively manage and organize maintenance records for your BTO
            flat, create a dedicated system for documenting repairs,
            inspections, and service appointments. Keep a maintenance log or
            digital spreadsheet to track dates, tasks performed, and any
            relevant notes or observations. Store important documents such as
            warranties, receipts, and manuals in a secure and easily accessible
            location for future reference.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/home-maintenance/home-care-guide/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What should I do if I encounter maintenance issues beyond my
          capability to resolve?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            If you encounter maintenance issues beyond your capability to
            resolve, consider seeking assistance from qualified professionals
            such as licensed contractors, plumbers, electricians, or
            HDB-approved service providers. Be proactive in addressing issues
            and don't hesitate to ask for help when needed to prevent further
            damage or safety hazards. If the issue is covered under warranty or
            insurance, contact the respective provider for assistance.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/home-maintenance">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          When should I contact the local town council for maintenance issues in
          my BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            You should contact the local town council for maintenance issues in
            your BTO flat when the problem is beyond your capability to resolve
            or if it concerns common areas, facilities, or services managed by
            the town council. Examples include issues with public lighting,
            cleanliness of common areas, pest infestations in shared spaces, or
            malfunctioning lifts and rubbish chutes.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/home-maintenance">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I reach the local town council to report maintenance issues or
          seek assistance?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            You can reach the local town council to report maintenance issues or
            seek assistance through various channels, such as their hotline,
            email, online feedback form, or mobile app. Check the town council's
            website or community notice boards for contact information and
            operating hours. Provide detailed information about the issue,
            including your name, contact details, and the location and nature of
            the problem, to facilitate prompt action.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/home-maintenance">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Should I invest in a home maintenance plan or insurance coverage for
          my BTO flat? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Investing in a home maintenance plan or insurance coverage for your
            BTO flat can provide added peace of mind and financial protection
            against unexpected maintenance expenses or emergencies. Evaluate the
            coverage, terms, and cost of various plans or insurance policies
            available from reputable providers. Consider factors such as the age
            and condition of your flat, your budget, and the level of coverage
            needed to make an informed decision.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.moneysmart.sg/home-insurance/bto-renovation-coverage-ms">
              {" "}
              MoneySmart{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I maintain the value and aesthetics of my BTO flat over time?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To maintain the value and aesthetics of your BTO flat over time,
            adopt a proactive approach to maintenance and regular upkeep.
            Implement a cleaning schedule to keep surfaces and fixtures clean
            and free of dirt and debris. Address minor repairs promptly to
            prevent deterioration and maintain the overall condition of the
            flat. Consider periodic updates or renovations to refresh the
            interior and enhance its appeal while adhering to HDB guidelines and
            regulations.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://9creation.com.sg/tips-for-keeping-a-4-room-hdb-flat-in-good-condition/">
              {" "}
              9creation{" "}
            </a>
          </p>
        </div>
      </div>
      <div className="panel" id="panel8">
        <div className="progressbar">
          <div
            className="highlightedcircle"
            id="highlightedcircle"
            style={{ marginLeft: "1005px", marginTop: "-16px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "-40px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "100px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "250px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "400px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "550px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "700px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "850px", marginTop: "-21px" }}
          ></div>
          <div
            className="circle"
            id="circle"
            style={{ marginLeft: "1000px", marginTop: "-21px" }}
          ></div>
          <div className="rectangle" id="rectangle"></div>
        </div>
        <h2 style={{ fontSize: "42px" }}>
          Resale & Upgrading Options <span className="counter"></span>
        </h2>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are the steps involved in selling my BTO flat in the resale
          market? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Selling your BTO flat in the resale market involves several steps.
            First, check your eligibility and ensure that you've met the Minimum
            Occupation Period (MOP) requirement. Engage a real estate agent to
            assist with the sale, if desired. Next, obtain a valuation of your
            flat from HDB or a licensed valuer. Advertise your flat for sale and
            negotiate with potential buyers. Once you've found a buyer, submit
            an Option to Purchase (OTP) and proceed with the resale application
            process through HDB.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/selling-a-flat/overview/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I sell my BTO flat before the Minimum Occupation Period (MOP)
          ends? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Generally, you cannot sell your BTO flat before the Minimum
            Occupation Period (MOP) ends. The MOP is typically five years from
            the date of key collection for non-Studio Apartments and three years
            for Studio Apartments. However, there are exceptions, such as in
            cases of divorce, death, or financial hardship, where approval for
            early resale may be granted by HDB.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.propertyguru.com.sg/property-guides/mop-sell-hdb-singapore-16413/">
              {" "}
              PropertyGuru{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.hdb.gov.sg/residential/selling-a-flat/eligibility/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What factors should I consider before deciding to sell my BTO flat in
          the resale market?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Before deciding to sell your BTO flat in the resale market, consider
            several factors. Firstly, evaluate your current housing needs and
            long-term plans to ensure that selling aligns with your goals.
            Assess the local property market conditions, including demand,
            pricing trends, and competition, to determine the optimal timing for
            selling. Take into account any outstanding loans or financial
            obligations related to the flat, such as mortgages or accrued
            interest. Additionally, consider the potential capital gains or
            losses associated with selling your BTO flat, taking into account
            factors such as depreciation, renovation investments, and prevailing
            market conditions. Evaluate the impact of selling on your overall
            financial portfolio and explore alternative housing options, such as
            upgrading to a larger flat or downsizing to a more suitable
            property. It's essential to weigh these factors carefully and seek
            advice from real estate professionals or financial advisors to make
            an informed decision about selling your BTO flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://jimmy-sum.com/blog/5-key-factors-to-consider-before-selling-your-hdb/">
              {" "}
              JimmySum{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are the costs involved in selling my BTO flat in the resale
          market? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            The costs involved in selling your BTO flat in the resale market may
            include agent fees/commissions, legal fees for conveyancing
            services, valuation fees, and administrative fees payable to HDB for
            processing the resale application. Additionally, you may need to
            settle any outstanding mortgage loans, accrued interest, or other
            financial obligations related to the flat.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.99.co/singapore/insider/hidden-costs-selling-house/">
              {" "}
              99.co{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.singsaver.com.sg/blog/hidden-cost-of-selling-hdb-flat">
              {" "}
              SingSaver{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are the options available for upgrading or downgrading to another
          flat after selling my BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            After selling your BTO flat, you have several options for upgrading
            or downgrading to another flat. You can purchase a larger flat in
            the resale market or apply for a new BTO flat or Sale of Balance
            Flat (SBF) offered by HDB. Alternatively, you can explore private
            property options or consider renting while evaluating your housing
            needs and preferences..
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://propseller.com/guides-insights/hdb-flat-downgrade-step-by-step-guide/">
              {" "}
              PropSeller{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.99.co/singapore/insider/upgrade-property-type-sell-bto/">
              {" "}
              99.co{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I apply for any housing grants or subsidies when purchasing
          another flat after selling my BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you may be eligible to apply for housing grants or subsidies
            when purchasing another flat after selling your BTO flat, depending
            on your eligibility criteria and the type of flat you're buying.
            Common grants include the Enhanced CPF Housing Grant (EHG),
            Additional CPF Housing Grant (AHG), and Proximity Housing Grant
            (PHG). Check the eligibility requirements and application procedures
            for each grant to determine your eligibility.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/couples-and-families/cpf-housing-grants-for-resale-flats-families#:~:text=Under%20the%20CPF%20Housing%20Grant,Enhanced%20CPF%20Housing%20Grant%20(EHG)/">
              {" "}
              HDB{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I enhance the resale value of my BTO flat before putting it on
          the market? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            To enhance the resale value of your BTO flat before putting it on
            the market, consider making cosmetic upgrades and repairs to improve
            its overall condition and appeal. This may include painting the
            walls, replacing worn-out fixtures, updating outdated features, and
            decluttering the space to create a clean and inviting atmosphere.
            Highlight the unique features and selling points of your flat to
            attract potential buyers and maximize its resale value.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/singles/">
              {" "}
              HDB{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.dbs.com.sg/personal/articles/nav/my-home/the-single-guide-to-buying-a-HDB-flat-in-singapore#:~:text=From%202H2024%2C%20with%20the%20new,flat%20in%20the%20resale%20market/">
              {" "}
              DBS{" "}
            </a>
          </p>
          <p>
            3.{" "}
            <a href="https://www.moneysmart.sg/home-loan/housing-guide-for-singles-ms/">
              {" "}
              MoneySmart{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          Can I rent out my BTO flat after purchasing another property?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Yes, you can rent out your BTO flat after purchasing another
            property, subject to certain conditions and approvals. If you've
            fulfilled the Minimum Occupation Period (MOP), you can rent out the
            entire flat or specific rooms to tenants. However, you must comply
            with HDB's regulations on subletting, including obtaining approval
            from HDB and adhering to occupancy limits and other requirements.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.99.co/singapore/insider/ways-increase-property-value-before-selling/">
              {" "}
              99.co{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://ohmyhome.com/en-sg/blog/tips-to-enhance-your-hdb-resale-flats-value/">
              {" "}
              Ohmyhome{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          What are some common pitfalls to avoid when selling my BTO flat in the
          resale market? <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            Common pitfalls to avoid when selling your BTO flat in the resale
            market include overpricing the property, neglecting necessary
            repairs or maintenance, failing to disclose relevant information to
            potential buyers, and being inflexible during negotiations. It's
            essential to work with a reliable real estate agent, conduct
            thorough due diligence, and adhere to legal and ethical standards
            throughout the selling process to achieve a successful and fair
            transaction.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://blog.bluenest.sg/selling-property-mistakes//">
              {" "}
              BlueNest{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.99.co/singapore/insider/6-things-seller-avoid-selling-home/">
              {" "}
              99.co{" "}
            </a>
          </p>
        </div>
        <button
          className="accordion"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          How can I leverage government schemes or incentives to facilitate my
          upgrading options after selling my BTO flat?{" "}
          <input type="checkbox" className="section-checkbox" />
        </button>
        <div className="panel">
          <p style={{ lineHeight: "2.5", marginRight: "20%" }}>
            You can leverage government schemes or incentives to facilitate your
            upgrading options after selling your BTO flat. For instance, you may
            be eligible for housing grants such as the Enhanced CPF Housing
            Grant (EHG) or Additional CPF Housing Grant (AHG) when purchasing a
            new flat or executive condominium (EC). Explore other schemes such
            as the Proximity Housing Grant (PHG) or Enhanced Contra Facility
            (ECF) to optimize your financing and minimize cash outlay.
            Additionally, consult with HDB or financial advisors to assess your
            eligibility and maximize the benefits available to you.
          </p>
          <p style={{ fontWeight: "bold" }}>
            For additional information from external resources:
          </p>
          <p>
            1.{" "}
            <a href="https://www.madeforfamilies.gov.sg/support-measures/your-home-matters-new/housing-schemes-and-grants">
              {" "}
              MadeforFamilies.gov{" "}
            </a>
          </p>
          <p>
            2.{" "}
            <a href="https://www.cpf.gov.sg/member/home-ownership/plan-your-housing-journey/upgrading-your-home">
              {" "}
              CPF{" "}
            </a>
          </p>
        </div>
      </div>

      <div className="rectangle-container"></div>
    </div>
  );
};

export default BtoPlannerPage;
