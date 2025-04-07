import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './DonutChart.scss';

function DonutChart({ data, width, height }) {
  const ref = useRef();
  const colors = ['#277C78', '#82C9D7', '#F2CDAC', '#626070', '#C94736', '#AF81BA', '#597C7C']


  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;


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
      

  }, [data, width, height, colors]);


  return (
    <div className='donut-chart'>
        <svg ref={ref}></svg>;
        <div className="donut-legend">
            {data.map((budget, i) => (
            <div key={i} className="donut-legend__item">
                <span
                    className="donut-legend__label"
                    style={{ borderLeft: `0.6rem solid ${colors[i % colors.length]}` }}
                >
                    {budget.name}
                </span>
            </div>
            ))}
        </div>
  </div>


  ) 
}

export default DonutChart;
