import React from "react";
import "./MobileNavbar.scss";
import { OverviewIcon, TransactionsIcon, BudgetsIcon, PotsIcon } from '../reusable/small/Icons';

function MobileNavbar({ activeSection, setActiveSection }) {
  return (
    <nav className="navbar">
      <button className={`navbar__item ${activeSection === "overview" ? "active" : ""}`}
        onClick={() => setActiveSection("overview")}>
        <span className="navbar__icon">
          <OverviewIcon size={19} color="#B3B3B3" />
        </span>
        <span className="navbar__text">Overview</span>
      </button>
      <button className={`navbar__item ${activeSection === "transactions" ? "active" : ""}`}
        onClick={() => setActiveSection("transactions")}>
        <span className="navbar__icon">
          <TransactionsIcon size={19} color="#B3B3B3" />
        </span>
        <span className="navbar__text">Transactions</span>
      </button>
      <button className={`navbar__item ${activeSection === "budgets" ? "active" : ""}`}
        onClick={() => setActiveSection("budgets")}>
        <span className="navbar__icon">
          <BudgetsIcon size={19} color="#B3B3B3" />
        </span>
        <span className="navbar__text">Budgets</span>
      </button>
      <button className={`navbar__item ${activeSection === "pots" ? "active" : ""}`}
        onClick={() => setActiveSection("pots")}>
        <span className="navbar__icon">
          <PotsIcon size={19} color="#B3B3B3" />
        </span>
        <span className="navbar__text">Pots</span>
      </button>
    </nav>
  );
}

export default MobileNavbar;
