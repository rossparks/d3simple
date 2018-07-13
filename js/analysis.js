var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 5000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#d3div").append("svg")
    .attr("width", '100%')
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("/s3-proxy/data/adWordsLocations.csv", function(d) {
  return {
    criteria_id : +d["Criteria ID"],
    name : d.Name,
    canonical_name : d["Canonical Name"],
    country : d["Country Code"],
    parent_id : +d["Parent ID"],
    status : d.Status,
    target_type : d["Target Type"]
  };
},function(data) {
	var countryCount = d3.nest()
	  .key(function(d) { return d.country; })
	  .rollup(function(v) { return v.length; })
	  .entries(data)
	  .sort(function(a, b){ return d3.descending(a.values, b.values); });

	x.domain(countryCount.map(function(d) { return d.key; }));
	y.domain([0, d3.max(countryCount, function(d) { return d.values; })]); 

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Locations");

	svg.selectAll(".bar")
	  .data(countryCount)
	.enter().append("rect")
	  .attr("class", "bar")
	  .attr("x", function(d) { return x(d.key); })
	  .attr("width", x.rangeBand())
	  .attr("y", function(d) { return y(d.values); })
	  .attr("height", function(d) { return height - y(d.values); });

});