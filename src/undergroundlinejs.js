(function() {

    var color = d3.scale.category10();
    var color = function(idx) {
        var colors = ['#a5291f', '#ff143a'];
        return colors[idx];
    };
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

        root.lines.forEach(function(line, lineindex) {

            var strokeElement = svg.append("g")
                .attr("class", "stroke");

            var stationsElement = svg.append("g")
                .attr("class", "stations");

            strokeElement.datum(line.stations)
                .append("path")
                .attr("stroke", color(lineindex))
                .attr("stroke-linecap", "round")
                .attr("stroke-width", "5")
                .attr("fill", "none")
                .attr("d", d3.svg.line()
                    .x(function(d, idx) {
                        var station = sameStationInOtherLine(d, lineindex, root.lines);
                        if (station.x) {
                            return station.x;
                        }
                        return calculateX(d, idx, lineindex);
                    })
                    .y(function(d, idx) {
                        var station = sameStationInOtherLine(d, lineindex, root.lines);
                        if (station.y) {
                            return calculateYBySameStation(station);
                        }
                        return calculateY(d, lineindex);
                    })
            );

            var node = stationsElement.selectAll("g")
                .data(line.stations)
                .enter()
                .append("g");

            node.attr("transform", function(d, index) {

                var station = sameStationInOtherLine(d, lineindex, root.lines);
                if (station.x) {
                    d.x = station.x;
                    d.y = calculateYBySameStation(station);
                    d.name = "";
                } else {
                    d.x = calculateX(d, index, lineindex);
                    d.y = calculateY(d, lineindex);
                }

                return "translate(" + d.x + "," + d.y + ")";
            }).attr("class", "node");

            node.append("circle")
                .attr("r", 1.6);

            node.append("text")
                .attr("x", 12)
                .attr("dy", ".35em")
                .attr("transform", function(d) {
                    return "translate(0,0) rotate(" + ((lineindex * 80) - 40) + ",0,0)"
                })
                .text(function(d) {
                    return d.name;
                });
        });
    });
})();

function calculateX(d, idx, lineindex) {
    return idx * 60 + lineindex * 390;
}

function calculateY(d, idx, station) {
    return 10 + (idx * 50);
}

function calculateYBySameStation(station) {
    return station.y + station.count * 3.4;
}


function sameStationInOtherLine(rootStation, lineindex, lines) {
    var result = undefined;
    lines.forEach(function(line) {
        line.stations.forEach(function(station, idx) {
            if (station.name == rootStation.name) {
                if (result == undefined) {
                    result = {};
                    result.count = 1;
                } else {
                    result.count = result.count + 1;
                }
            }
            if (station.name == rootStation.name && station.x != undefined) {
                result.x = station.x;
                result.y = station.y;
            }
        });
    });
    return result;
}