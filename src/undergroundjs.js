(function() {

    var color = d3.scale.category10();

    var height = 600;
    var width = 1140;

    var margin = {
        top: 50,
        right: 70,
        bottom: 20,
        left: 70
    };

    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(30)
	.linkStrength(10)
        .charge(-200);

    var svg = d3.select("#map")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom().on("zoom", function() {
            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
        }))
        .append("g")
        .attr("transform", "translate(40,0)");


    d3.json("stations.json", function(error, root) {

        if (error) {
            console.log("ERROR!");
            return 0;
        }

        var node_data_object = {};
        var link_data = [];

        root.lines.forEach(function(line) {
            for (var i = 0; i < line.stations.length; i++) {
                node_data_object[line.stations[i].name] = line.stations[i];
            }
        });

        root.lines.forEach(function(line, index) {
            for (var i = 0; i < line.stations.length; i++) {
                if (line.stations[i + 1] != undefined) {
                    link_data.push({
                        target: node_data_object[line.stations[i].name],
                        source: node_data_object[line.stations[i + 1].name],
                        line: line.name,
                        index: index
                    });
                }

            }
        });


        var node_data = Object.keys(node_data_object).map(function(k) {
            return node_data_object[k]
        });

        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                if (d.index == 1) {
                    return "M" +
                        (d.source.x + Math.abs(dy) / (Math.abs(dx) + Math.abs(dy)) * 12) + "," +
                        (d.source.y + Math.abs(dx) / (Math.abs(dx) + Math.abs(dy)) * 12) + "L" +
                        (d.target.x + Math.abs(dy) / (Math.abs(dx) + Math.abs(dy)) * 12) + "," +
                        (d.target.y + Math.abs(dx) / (Math.abs(dx) + Math.abs(dy)) * 12);
                }

                return "M" +
                    d.source.x + "," +
                    d.source.y + "L" +
                    d.target.x + "," +
                    d.target.y;
            });
            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }

        force.on("tick", tick)
            .nodes(node_data)
            .links(link_data)
            .start();

        var path = svg.append("svg:g")
            .selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", "link")
            .attr("stroke", function(d, i) {
                return color(d.line);
            })
            .attr("marker-end", "url(#end)");

        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        node.append("circle")
            .attr("r", function(d, i) {
                return d.weight;
            });

        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.name;
            });
    });
})();
