(function() {

    var color = d3.scale.category10();

    var height = 600;
    var width = 1140;

    var margin = {
        top: 50,
        left: 20,
    };



    var svg = d3.select("#map")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("station.json", function(error, root) {

        root.lines.forEach(function(line) {

            var lineElement = svg.append("g")
                .attr("class", "line");

            lineElement.append("g")
                .datum(line.stations)
                .append("path")
                .attr("d", d3.svg.line()
                    .x(function(_, idx) {
                        return 10 * idx;
                    })
                    .y(function(_, idx) {
                        return 10 * idx;
                    })
            )

            var node = lineElement.selectAll("g")
                .data(line.stations)
                .enter()
                .append("g");


            node.attr("transform", function(d, index) {
                d.x = index * 45;
                d.y = 10;
                return "translate(" + d.x + "," + d.y + ")";
            }).attr("class", "node");

            node.append("circle")
                .attr("r", 3);

            node.append("text")
                .attr("x", 12)
                .attr("dy", ".35em")
                .attr("transform", "translate(0,0) rotate(40,0,0)")
                .text(function(d) {
                    return d.name;
                });


        });
    });
})();