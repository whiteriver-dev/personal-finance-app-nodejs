import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './DonutChart.scss';

function DonutChart({ data, width, height }) {
  const ref = useRef();


  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;
    const colors = ['#277C78', '#82C9D7', '#F2CDAC', '#626070', '#C94736', '#AF81BA', '#597C7C']

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
      .innerRadius(radius * 0.55) // Donut thickness
      .outerRadius(radius * 0.9);

    // Color scale (fallback if no props)

    // Draw slices
    chart
      .selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('stroke', '#fff')
      .style('stroke-width', '2px');

    const innerOverlayArc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.66); // inner third (0.5 + one third of 0.4 thickness)
    
    chart
      .selectAll('inner-overlay')
      .data(data_ready)
      .join('path')
      .attr('d', innerOverlayArc)
      .attr('fill', '#fff') // or a highlight color like "#000"
      .attr('opacity', 0.25);
      

  }, [data, width, height]);

  return <svg ref={ref}></svg>;
}

export default DonutChart;
