import React from "react";
import { Link } from "react-router-dom";
import "./MobileNavbar.scss";

import OverviewIcon from '../../assets/images/icon-nav-overview.svg';
import TransactionsIcon from '../../assets/images/icon-nav-transactions.svg';
import BudgetsIcon from '../../assets/images/icon-nav-budgets.svg';
import PotsIcon from '../../assets/images/icon-nav-pots.svg';
import RecurringBillsIcon from '../../assets/images/icon-nav-recurring-bills.svg';



function MobileNavbar({ activeSection, setActiveSection }) {
  return (
    <nav className="navbar">
      <button className={`navbar__item ${activeSection === "overview" ? "active" : ""}`}
        onClick={() => setActiveSection("overview")}>
        <span className="navbar__icon"><img src={OverviewIcon} alt='icon'/></span>
        <span className="navbar__text">Overview</span>
      </button>
      <button className={`navbar__item ${activeSection === "transactions" ? "active" : ""}`}
        onClick={() => setActiveSection("transactions")}>
        <span className="navbar__icon"><img src={TransactionsIcon} alt='icon'/></span>
        <span className="navbar__text">Transactions</span>
      </button>
      <button className={`navbar__item ${activeSection === "budgets" ? "active" : ""}`}
        onClick={() => setActiveSection("budgets")}>
        <span className="navbar__icon"><img src={BudgetsIcon} alt='icon'/></span>
        <span className="navbar__text">Budgets</span>
      </button>
      <button className={`navbar__item ${activeSection === "pots" ? "active" : ""}`}
        onClick={() => setActiveSection("pots")}>
        <span className="navbar__icon"><img src={PotsIcon} alt='icon'/></span>
        <span className="navbar__text">Pots</span>
      </button>
      <button className={`navbar__item ${activeSection === "recurring-bills" ? "active" : ""}`}
        onClick={() => setActiveSection("recurring-bills")}>
        <span className="navbar__icon"><img src={RecurringBillsIcon} alt='icon'/></span>
        <span className="navbar__text">Recurring Bills</span>
      </button>
    </nav>
  );
}

export default MobileNavbar;
