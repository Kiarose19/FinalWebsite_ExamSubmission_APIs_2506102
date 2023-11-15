 // NEO API endpoint for a specific asteroid (replace DEMO_KEY with your actual API key)
 const neoApiUrl =
 "https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=qV2aaLaPkRIr8i4UloJ9uUCEcZQh7BpDuEBn4Ckk";

// Request data from NEO API
fetch(neoApiUrl)
 .then((response) => response.json())
 .then((data) => {
   // Extract relevant information from the API response
   const distanceData = data.close_approach_data.map((approach) => ({
     date: new Date(approach.close_approach_date).toLocaleDateString(),
     distance: parseFloat(approach.miss_distance.kilometers),
   }));

   // Create the D3.js SVG container for the line chart
   const svg = d3
     .select("#line-chart-container")
     .append("svg")
     .attr("width", 1250)
     .attr("height", 600);
     

   // Set the dimensions of the chart
   const margin = { top: 20, right: 20, bottom: 30, left: 200 };
   const width = 1200 - margin.left - margin.right;
   const height = 600 - margin.top - margin.bottom;

   // Create a group for the chart within the SVG container
   const chart = svg
     .append("g")
     .attr(
       "transform",
       "translate(" + margin.left + "," + margin.top + ")"
     );

   // Define scales for x and y axes
   const xScale = d3
     .scaleBand()
     .domain(distanceData.map((d) => d.date))
     .range([0, width]);

   const yScale = d3
     .scaleLinear()
     .domain([0, d3.max(distanceData, (d) => d.distance)])
     .range([height, 0]);

   // Define x and y axes
   const xAxis = d3.axisBottom(xScale);
   const yAxis = d3.axisLeft(yScale);

   // Add x axis
   chart
     .append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis)
     .attr('fill', "white")

   // Add y axis
   chart.append("g")
   .call(yAxis)
   .attr('fill', "white")

   // Draw the line chart
   chart
     .append("path")
     .data([distanceData])
     .attr(
       "d",
       d3
         .line()
         .x((d) => xScale(d.date) + xScale.bandwidth() / 1)
         .y((d) => yScale(d.distance))
     )
     .attr("fill", "none")
     .attr("stroke", "orange");

   // Draw asteroids for each data point
   chart
     .selectAll(".asteroid")
     .data(distanceData)
     .enter()
     .append("circle")
     .attr("class", "asteroid")
     .attr("cx", (d) => xScale(d.date) + xScale.bandwidth() / 2)
     .attr("cy", (d) => yScale(d.distance))
     .attr("r", 8) // Adjust the radius to change the size of the asteroids
     .attr("fill", "gray")
     .attr("stroke", "black")
     .attr("stroke-width", 2);

     svg 
     .append("g")
     .attr('transform', "translate(0," + height + ")")
     .call(d3.axisBottom(x))
     .selectAll("text")
     .attr('transform', "rotate(-65)")
     .style('text-anchor', 'end')

     svg
     .append("text")
     .attr('transform', "translate(" + width / 2 + " ," + (height + margin.top + 50) + ")")
     .style('text-anchor', 'middle')
     .style('fill', 'white')
     .text("Date (closest approach date of asteroids to earth)");

 })
 .catch((error) => console.error("Error fetching NEO data:", error));



