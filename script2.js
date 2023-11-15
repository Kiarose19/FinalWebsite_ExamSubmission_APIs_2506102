const spaceship = d3.select("#spaceship");

      // Function to rotate the spaceship
      function rotateSpaceship() {
        // Rotate the spaceship by 360 degrees
        spaceship
          .transition()
          .duration(5000) // Rotation duration in milliseconds
          .tween("rotate", function () {
            const i = d3.interpolate(0, 360); // Start and end rotation angles
            return function (t) {
              // Apply the rotation transformation
              spaceship.style(
                "transform",
                `translate(${window.innerWidth / 2}px, ${
                  window.innerHeight / 2
                }px) rotate(${i(t)}deg) translate(-50%, -50%)`
              );
            };
          })
          .on("end", rotateSpaceship); // Restart rotation when it ends
      }

      // Start the initial rotation
      rotateSpaceship();

      // Handle user click on a data point
      function handleDataPointClick(data) {
        // Move the spaceship to the clicked data point's coordinates
        const x = xScale(data.close_approach_data[0].miss_distance.kilometers);
        const y = Math.random() * window.innerHeight;

        // Animate the spaceship towards the clicked point
        spaceship
          .transition()
          .duration(500)
          .style(
            "transform",
            `translate(${x}px, ${y}px) rotate(0deg) translate(-50%, -50%)`
          );
      }

      // Set your API key and date range
      const apiKey = "qV2aaLaPkRIr8i4UloJ9uUCEcZQh7BpDuEBn4Ckk"; // Replace with your actual API key
      const startDate = "2015-09-07"; // Replace with your start date
      const endDate = "2015-09-12"; // Replace with your end date

      // Fetch NEOs from the NASA NEO API
      const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

      // Create scales to map asteroid distances to screen positions
      const xScale = d3.scaleLinear().range([0, window.innerWidth]);

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Extract relevant information from the API response
          const neoData = Object.values(data.near_earth_objects)[0];

          // Update the xScale domain based on asteroid distances
          xScale.domain([
            0,
            d3.max(
              neoData,
              (d) => d.close_approach_data[0].miss_distance.kilometers
            ),
          ]);

          // Create a data point for each NEO
          const dataPoints = d3
            .select("body")
            .selectAll(".data-point")
            .data(neoData)
            .enter()
            .append("div")
            .attr("class", "data-point")
            .style(
              "left",
              (d) =>
                `${xScale(d.close_approach_data[0].miss_distance.kilometers)}px`
            )
            .style("top", (d) => `${Math.random() * window.innerHeight}px`)
            .on("click", handleDataPointClick);
        })
        .catch((error) => console.error("Error fetching data:", error));
    
