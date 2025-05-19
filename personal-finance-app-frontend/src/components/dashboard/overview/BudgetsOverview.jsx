import './BudgetsOverview.scss';
import React from 'react';
import { CaretRightIcon } from '../../reusable/small/Icons';
import DonutChart from '../budgets/DonutChart';

function BudgetsOverview({ budgets, setActiveSection }) {
    return (
        <div className='budgets-overview'>
            <div className='overview-header'>
                <h2 className='overview-header__title'>Budgets</h2>
                <button className='see-details'
                    onClick={() => {
                        setActiveSection('budgets');
                    }}>
                    See details <span><CaretRightIcon size='9' color='#201F24'/></span>
                </button>
            </div>
            <div className='budgets-overview__list'>
                <DonutChart data={budgets} width={240} height={240} />
            </div>
        </div>
    );
}

export default BudgetsOverview;


// Pre-deployment code check DONE