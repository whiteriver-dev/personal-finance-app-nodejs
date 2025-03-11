import React from "react";
import { Link } from "react-router-dom";
import "./MobileNavbar.scss";

import OverviewIcon from '../../assets/images/icon-nav-overview.svg';
import TransactionsIcon from '../../assets/images/icon-nav-transactions.svg';
import BudgetsIcon from '../../assets/images/icon-nav-budgets.svg';
import PotsIcon from '../../assets/images/icon-nav-pots.svg';
import RecurringBillsIcon from '../../assets/images/icon-nav-recurring-bills.svg';



function MobileNavbar() {
  return (
    <nav className="navbar">
      <Link to="/overview" className="navbar__item">
        <div className="navbar__item">
          <span className="navbar__icon"><img src={OverviewIcon} alt='icon'/></span>
          <span className="navbar__text">Overview</span>
        </div>
      </Link>
      <Link to="/transactions" className="navbar__item">
        <div className="navbar__item">
          <span className="navbar__icon"><img src={TransactionsIcon} alt='icon'/></span>
          <span className="navbar__text">Transactions</span>
        </div>
      </Link>
      <Link to="/budgets" className="navbar__item">
        <div className="navbar__item">
          <span className="navbar__icon"><img src={BudgetsIcon} alt='icon'/></span>
          <span className="navbar__text">Budgets</span>
        </div>
      </Link>
      <Link to="/pots" className="navbar__item">
        <div className="navbar__item">
          <span className="navbar__icon"><img src={PotsIcon} alt='icon'/></span>
          <span className="navbar__text">Pots</span>
        </div>
      </Link>
      <Link to="/recurring-bills" className="navbar__item">
        <div className="navbar__item">
          <span className="navbar__icon"><img src={RecurringBillsIcon} alt='icon'/></span>
          <span className="navbar__text">Recurring Bills</span>
        </div>
      </Link>
    </nav>
  );
}

export default MobileNavbar;
