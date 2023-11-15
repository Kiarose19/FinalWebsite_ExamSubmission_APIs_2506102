document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "6gR7eApMZgrLSRDbUsshjwza78UIFiP2aw2Xw5QO";
    const apiURL = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`;

    fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
            const dates = Object.keys(data.near_earth_objects);
            const counts = dates.map((date) => data.near_earth_objects[date].length);

            const svgHeight = 400;
            const svgWidth = 800;
            const margin = { top: 20, right: 20, bottom: 80, left: 40 };

            const height = svgHeight - margin.top - margin.bottom;
            const width = svgWidth - margin.left - margin.right;

            const svg = d3
                .select("#bargraph")
                .append("svg")
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            const x = d3.scaleBand().range([0, width]).padding(0.4);
            const y = d3.scaleLinear().range([height, 0]);

            x.domain(dates);
            y.domain([0, d3.max(counts)]);

            // Attempt to add asteroid images
           // ...

// Generate asteroids using circles with asteroid texture
svg.selectAll(".asteroid-circle")
.data(dates)
.enter()
.append("circle")
.attr("class", "asteroid-circle")
.attr("cx", (d) => x(d) + x.bandwidth() / 2)
.attr("cy", (d) => y(data.near_earth_objects[d].length))
.attr("r", 22)  // Adjust the radius as needed
.attr("fill", "url(#asteroidTexture)");  // Use the asteroid texture

// Define the asteroid texture pattern
svg.append("defs")
.append("pattern")
.attr("id", "asteroidTexture")
.attr("width", 20)
.attr("height", 20)
.attr("patternUnits", "userSpaceOnUse")
.append("rect")
.attr("width", 20)
.attr("height", 20)
.attr("fill", "url(#asteroidGradient)");

// Define the asteroid gradient for the texture
svg.select("defs")
.append("radialGradient")
.attr("id", "asteroidGradient")
.attr("cx", "50%")
.attr("cy", "60%")
.attr("r", "70%")
.selectAll("stop")
.data([
    { offset: "1%", color: "#A9A9A9" },  // Dark gray color
    { offset: "50%", color: "#808080" }, // Medium gray color
    { offset: "95%", color: "#A9A9A9" } // Dark gray color
])
.enter().append("stop")
.attr("offset", (d) => d.offset)
.attr("stop-color", (d) => d.color);

// ...


            svg
                .append("g")
                .attr('transform', "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr('transform', "rotate(-65)")
                .style('text-anchor', 'end');

            svg
                .append("text")
                .attr('transform', "translate(" + width / 2 + " ," + (height + margin.top + 50) + ")")
                .style('text-anchor', 'middle')
                .style('fill', 'white')
                .text("Date (closest approach date of asteroids to earth)");

            svg.append("g")
                .call(d3.axisLeft(y).ticks(5));

            svg
                .append("text")
                .attr('transform', "rotate(-90)")
                .attr('y', 0 - margin.left)
                .attr('x', 0 - height / 2)
                .attr('dy', "1em")
                .style('text-anchor', 'middle')
                .style('fill', 'white')
                .text("Number of Asteroids");
        });
});
