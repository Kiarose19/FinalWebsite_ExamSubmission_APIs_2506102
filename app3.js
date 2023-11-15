// Initial date range
let startDate = "2015-09-07";
let endDate = "2015-09-13";

// Fetch data from the NEO API and update the graph
function updateGraph() {
  startDate = document.getElementById("start-date").value;
  endDate = document.getElementById("end-date").value;

  const apiKey = "qV2aaLaPkRIr8i4UloJ9uUCEcZQh7BpDuEBn4Ckk";
  const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

  d3.json(apiUrl)
    .then((data) => {
      // Process the data and implement the visualization logic
      console.log(data);

      // Visualize NEO data
      visualizeNEOData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Visualize NEO data using D3.js
function visualizeNEOData(data) {
  const neoData = Object.entries(data.near_earth_objects).map(
    ([date, neoList]) => ({
      date: new Date(date),
      count: neoList.length,
    })
  );

  const margin = { top: 20, right: 20, bottom: 40, left: 200 };
  const width = 900 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Remove existing SVG elements
  d3.select("#chart").selectAll("*").remove();

  const svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(neoData, (d) => d.date))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(neoData, (d) => d.count)])
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.count));

  // Append the line
  svg
    .append("path")
    .data([neoData])
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  // Append the axes
  svg
    .append("g")
    .attr("class", "x-axis") // Add a class for easy identification
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    
    .selectAll('*')
    .style('stroke', 'white');

  svg
    .append("g")
    .attr("class", "y-axis") // Add a class for easy identification
    .call(d3.axisLeft(yScale))
    .selectAll('*')
    .style('stroke', 'white');
    

  // Add labels
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .attr("text-anchor", "middle")
    .text("Date")
    .style("fill", "white");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text("NEO Count")
    .style("fill", "white");

  // Add tooltip
  const tooltip = d3.select("#tooltip");

  // Use merge to handle both initial and update selections
  const dots = svg.selectAll(".dot").data(neoData);

  dots
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("fill", "orange")
    .attr("stroke", "white")
    .merge(dots) // Merge the enter selection with the update selection
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.count))
    .on("mouseover", (d) => {
      let tooltipContent = ""; // Declare tooltipContent outside the conditional block

      // Check if d.date is a valid Date object
      if (d.date instanceof Date && !isNaN(d.date)) {
        const formattedDate = d.date.toISOString().split("T")[0];
        tooltipContent = `
  <strong>Date:</strong> ${formattedDate}<br>
  <strong>NEO Count:</strong> ${d.count}
`;
      } else {
        console.error("Invalid date:", d.date);
      }

      tooltip
        .style("display", "block")
        .html(tooltipContent)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 30}px`)
        .style("width", "10px");
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  // Add zooming and panning
  const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

  svg.call(zoom);

  function zoomed(event) {
    const newXScale = event.transform.rescaleX(xScale);
    svg.select("path").attr(
      "d",
      line.x((d) => newXScale(d.date))
    );
    dots.attr("cx", (d) => newXScale(d.date));

    svg.select(".x-axis").call(d3.axisBottom(newXScale));
  }
}

// Initial call to visualize data
updateGraph();

