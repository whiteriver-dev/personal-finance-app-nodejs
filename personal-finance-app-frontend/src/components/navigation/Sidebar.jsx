import './Sidebar.scss';
import React, { useState } from 'react';
import LogoLarge from '../../assets/images/logo-large.svg';
import LogoSmall from '../../assets/images/logo-small.svg';
import { OverviewIcon, TransactionsIcon, BudgetIcon, PotsIcon } from '../reusable/small/Icons.jsx';
import Pots from '../dashboard/Pots.jsx';

function Sidebar({  activeSection, setActiveSection }) {

    const [isMinimized, setIsMinimized] = useState(false);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    }

    return (
        <nav className={`sidebar ${isMinimized ? "minimized" : ""}`}>
            <div className="sidebar__container">
                <div className='sidebar__logo'>
                    <img src={isMinimized ? LogoSmall : LogoLarge} alt="Logo" />
                </div>
                <button className={`sidebar__item ${activeSection === "overview" ? "active" : ""}`}
                    onClick={() => setActiveSection("overview")}>
                    <span className="sidebar__icon">
                        <OverviewIcon size={19} color="#B3B3B3" />
                    </span>
                    <span className="sidebar__text">Overview</span>
                </button>
                <button className={`sidebar__item ${activeSection === "transactions" ? "active" : ""}`}
                    onClick={() => setActiveSection("transactions")}>
                    <span className="sidebar__icon">
                        <TransactionsIcon size={19} color="#B3B3B3" />
                    </span>
                    <span className="sidebar__text">Transactions</span>
                </button>
                <button className={`sidebar__item ${activeSection === "budgets" ? "active" : ""}`}
                    onClick={() => setActiveSection("budgets")}>
                    <span className="sidebar__icon">
                        <BudgetIcon size={19} color="#B3B3B3" />
                    </span>
                    <span className="sidebar__text">Budgets</span>
                </button>
                <button className={`sidebar__item ${activeSection === "pots" ? "active" : ""}`}
                    onClick={() => setActiveSection("pots")}>
                    <span className="sidebar__icon">
                        <PotsIcon size={19} color="#B3B3B3" />
                    </span>
                    <span className="sidebar__text">Pots</span>
                </button>
             </div>
             <button
                 className={`sidebar__item toggle-btn`}
                 onClick={toggleSidebar}>
                    <span className="sidebar__icon">
                        <svg
                            fill="#B3B3B3" 
                            height="19" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="m14.0001 5.26002v8.99998c0 .1989-.079.3897-.2197.5304-.1406.1406-.3314.2196-.5303.2196h-2.25v3.75c.0001.1484-.0438.2936-.1262.417-.0824.1235-.1996.2197-.3367.2765s-.288.0717-.4336.0427c-.14554-.029-.27923-.1005-.38412-.2056l-9.000003-9c-.069733-.0696-.125052-.1523-.162795-.2434-.037743-.09102-.05717-.18862-.05717-.28718s.019427-.19615.05717-.2872.093062-.17377.162795-.24342l9.000003-9.000004c.10489-.105009.23858-.1765346.38412-.2055224.1456-.02898777.2965-.0141343.4336.0426801.1371.0568143.2543.1530353.3367.2764803s.1263.268565.1262.416987v3.749999h2.25c.1989 0 .3897.07902.5303.21967.1407.14065.2197.33142.2197.53033zm2.25-.75c-.1989 0-.3897.07902-.5303.21967-.1407.14065-.2197.33142-.2197.53033v8.99998c0 .1989.079.3897.2197.5304.1406.1406.3314.2196.5303.2196s.3897-.079.5303-.2196c.1407-.1407.2197-.3315.2197-.5304v-8.99998c0-.19891-.079-.38968-.2197-.53033-.1406-.14065-.3314-.21967-.5303-.21967zm3 0c-.1989 0-.3897.07902-.5303.21967-.1407.14065-.2197.33142-.2197.53033v8.99998c0 .1989.079.3897.2197.5304.1406.1406.3314.2196.5303.2196s.3897-.079.5303-.2196c.1407-.1407.2197-.3315.2197-.5304v-8.99998c0-.19891-.079-.38968-.2197-.53033-.1406-.14065-.3314-.21967-.5303-.21967z"/>
                            </svg>
                    </span>
                    <span className="sidebar__text">Minimize Menu</span>
                </button>
            </nav>
    )

}

export default Sidebar;