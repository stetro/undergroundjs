(function() {

    var color = d3.scale.category10();

    var height = 600;
    var width = 1140;

    var margin = {
        top: 100,
        left: 20,
    };

    var svg = d3.select("#map")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom().on("zoom", function() {
            var translate = d3.event.translate;
            translate[0] = translate[0] + margin.left;
            translate[1] = translate[1] + margin.top;
            svg.attr("transform", "translate(" + d3.event.translate +
                ")" + " scale(" + d3.event.scale + ")");
        }))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("src/station.json", function(error, root) {

        root.lines.forEach(function(line) {

            var strokeElement = svg.append("g")
                .attr("class", "stroke");

            var stationsElement = svg.append("g")
                .attr("class", "stations");

            strokeElement.datum(line.stations)
                .append("path")
                .attr("stroke", "red")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", "5")
                .attr("d", d3.svg.line()
                    .x(function(_, idx) {
                        return idx * 45;
                    })
                    .y(function(_, idx) {
                        return 10 * idx;
                    })
            )

            var node = stationsElement.selectAll("g")
                .data(line.stations)
                .enter()
                .append("g");

            node.attr("transform", function(d, index) {
                d.x = index * 45;
                d.y = 10 * index;
                return "translate(" + d.x + "," + d.y + ")";
            }).attr("class", "node");

            node.append("circle")
                .attr("r", 1.7);

            node.append("text")
                .attr("x", 12)
                .attr("dy", ".35em")
                .attr("transform", "translate(0,0) rotate(-40,0,0)")
                .text(function(d) {
                    return d.name;
                });
        });
    });
})();
