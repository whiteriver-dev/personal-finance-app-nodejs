import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import './DonutChart.scss';

function DonutChart({ data, width, height }) {
  const ref = useRef();
  const colors = useMemo(() => ['#277C78', '#82C9D7', '#F2CDAC', '#626070', '#C94736', '#AF81BA', '#597C7C'], []);
  

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;
    const totalBudget = d3.sum(data, d => d.amount);
    const totalSpent = d3.sum(data, d => d.spent ?? 0);


    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Pie layout
    const pie = d3.pie().value(d => d.amount).sort(null);
    const data_ready = pie(data);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.55) // 
      .outerRadius(radius * 0.9);

    // Draw slices
    chart
      .selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i % colors.length])

    const innerOverlayArc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.66); 
    
    chart
      .selectAll('inner-overlay')
      .data(data_ready)
      .join('path')
      .attr('d', innerOverlayArc)
      .attr('fill', '#fff') //
      .attr('opacity', 0.25);

    chart.append("text") // Text inside the donut
    .attr("text-anchor", "middle")
    .attr("dy", "0em")
    .attr("class", "donut-center__label")
    .text(`$${totalSpent}`);

    chart.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "2.4rem")
    .attr("class", "donut-center__subtext")
    .text(` of $${totalBudget} limit`);
      

  }, [data, width, height, colors]);


  return (
    <div className='donut-chart'>
        <svg ref={ref}></svg>
        <div className="donut-legend">
            <h2>Spending Summary</h2>
            {data.map((budget, i) => (
            <div key={i} className="donut-legend__item">
                    <span className="donut-legend__label" style={{ "--legend-color": colors[i % colors.length] }} >
                <span className='legend__budget-name'>{budget.name}</span> <span className='legend__budget-total'><span className='legend__budget-spent'>${budget.spent || 0}</span> <span className='legend__budget-amount'> of ${budget.amount}</span></span>
                </span>
            </div>
            ))}
        </div>
    </div>


  ) 
}

export default DonutChart;
