var name = [], handedness = [],
weight = [], height = [], avg = [],
HR = [];

var svg = d3.select("body").append("svg"); // temporary svg

var bar = true;
var pie = false;
var forced = false;

var bool_weight=false;
var bool_height=true;
var bool_avg=false;
var bool_hr=false;

var bin = 10;

var color = d3.scale.category20c();


d3.csv("data/baseball_data.csv", function(error, data) {
	if (error) throw error;

	data.forEach(function(d) {
	    //handedness.push(d.handedness);
	    height.push(+d.height);
	    weight.push(+d.weight);
	    avg.push(+d.avg);
	    HR.push(+d.HR);
	});
	
	create_bar();

});

function create_pie(){
	console.log("Create Pie")
	pie = true;
	bar = false;
	forced = false;

	document.getElementById("pc").style.color = "blue";
	document.getElementById("bc").style.color = "black";
	document.getElementById("fd").style.color = "black";

	if(bool_weight){
		plot_weight();
	}
	if(bool_height){
		plot_height();
	}
	if(bool_avg){
		plot_avg();
	}
	if(bool_hr){
		plot_hr();
	}
}

function create_bar(){
	bar = true;
	pie = false;
	forced = false;

	document.getElementById("bc").style.color = "blue";
	document.getElementById("pc").style.color = "black";
	document.getElementById("fd").style.color = "black";

	if(bool_weight){
		plot_weight();
	}
	if(bool_height){
		plot_height();
	}
	if(bool_avg){
		plot_avg();
	}
	if(bool_hr){
		plot_hr();
	}
}

function create_forced(){
	bar = false;
	pie = false;
	forced = true;

	document.getElementById("bc").style.color = "black";
	document.getElementById("pc").style.color = "black";
	document.getElementById("fd").style.color = "blue";

	if(bool_weight){
		plot_weight();
	}
	if(bool_height){
		plot_height();
	}
	if(bool_avg){
		plot_avg();
	}
	if(bool_hr){
		plot_hr();
	}
}

function plot_weight(){

	bool_weight=true;
	bool_height=false;
	bool_avg=false;
	bool_hr=false;

	document.getElementById("w").style.color = "blue";
	document.getElementById("h").style.color = "black";
	document.getElementById("a").style.color = "black";
	document.getElementById("hr").style.color = "black";

	if(bar){
		createHistogram(weight,bin);
	}
	if(pie){
		createPie(weight,bin);
	}
	if(forced){
		createFD(weight, bin);
	}
}

function plot_height(){

	bool_weight=false;
	bool_height=true;
	bool_avg=false;
	bool_hr=false;

	document.getElementById("w").style.color = "black";
	document.getElementById("h").style.color = "blue";
	document.getElementById("a").style.color = "black";
	document.getElementById("hr").style.color = "black";

	if(bar){
		createHistogram(height,bin);
	}
	if(pie){
		createPie(height,bin);
	}
	if(forced){
		createFD(height, bin);
	}
}

function plot_avg(){

	bool_weight=false;
	bool_height=false;
	bool_avg=true;
	bool_hr=false;

	document.getElementById("w").style.color = "black";
	document.getElementById("h").style.color = "black";
	document.getElementById("a").style.color = "blue";
	document.getElementById("hr").style.color = "black";

	if(bar){
		createHistogram(avg,bin);
	}
	if(pie){
		createPie(avg,bin);
	}
	if(forced){
		createFD(avg, bin);
	}
}

function plot_hr(){

	bool_weight=false;
	bool_height=false;
	bool_avg=false;
	bool_hr=true;

	document.getElementById("w").style.color = "black";
	document.getElementById("h").style.color = "black";
	document.getElementById("a").style.color = "black";
	document.getElementById("hr").style.color = "blue";

	if(bar){
		createHistogram(HR, bin);
	}
	if(pie){
		createPie(HR,bin);
	}
	if(forced){
		createFD(HR, bin);
	}
}

function createHistogram(array, bin){

	var margin = {top: 100, right: 10, bottom: 100, left: 400},
    width = 1500 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

    var svg = d3.select("svg");
    svg.selectAll('*').remove();

	svg = svg
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scale.ordinal().rangeRoundBands([0, width],0.10);
	var y = d3.scale.linear().range([height, 0]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom")
	var yAxis = d3.svg.axis().scale(y).orient("left")

    var widthBin = (d3.max(array) - d3.min(array))/bin;

    var data = d3.layout.histogram().bins(bin)(array);

    x.domain(data.map(function(d){ return (d.x+d.dx).toFixed(3); }));
	y.domain([0, d3.max(data, function(d){return d.length;})]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", "-.55em")
		.attr("transform", "rotate(-90)" );

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("");

	svg.selectAll("bar")
		.data(data)
		.enter()
		.append("rect")
		.style("fill", function(d,i){return color(i);})
		.attr("x", function(d){ return x((d.x+d.dx).toFixed(3)); })
		.attr("width", x.rangeBand())
		.attr("y", function(d){ return y(d.length); })
		.attr("height", function(d){ return height - y(d.length); })
		.on("mouseover", function(d,i) {
            d3.select(this).style("fill", "black").attr("width", x.rangeBand()*1.5).attr("y", y(d.length+10)).attr("height", height - y(d.length+10));
            svg.append("text")
            	.attr("id", "temp_text")
	            .attr("dy", y(d.length+10)-y(d.length)-1)
			    .attr("y", y(d.length))
			    .attr("x", x((d.x+d.dx).toFixed(3))+x.rangeBand()/2)
			    .attr("text-anchor", "middle")
			    .text(d.length)
				.attr("opacity",100);
        })
        .on("mouseout", function(d,i) {
            d3.select(this).style("fill", color(i)).attr("width", x.rangeBand()).attr("y", y(d.length)).attr("height", height - y(d.length));
            svg.select("#temp_text").remove();
        })
		.append("title").text(function(d){
            return d.length;
        });

    svg.on("click",function(){
    	create_pie()
	});
}

function createPie(array, bin){

    var svg = d3.select("svg");
    svg.selectAll('*').remove();

	var margin = {top: 100, right: 10, bottom: 100, left: 400},
    width = 1500 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;;

    var arc = d3.svg.arc().innerRadius(0).outerRadius(radius);

    svg = svg
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + ((width + margin.left + margin.right) / 2) +  ',' + ((height + margin.top + margin.bottom) / 2) + ')');

    var widthBin = (d3.max(array) - d3.min(array))/bin;

    var data = d3.layout.histogram().bins(bin)(array);

	var pie = d3.layout.pie()
		.value(function(d){return d.length;})
		.sort(null);

	console.log(pie(data));

	svg.selectAll('path')
		.data(pie(data))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d, i) {
			return color(i);
		})
		// .attr('stroke', "black")
		// .attr("stroke-width", 2)
		.on('mouseover', function(d,i) {
            d3.select(this).attr("d", d3.svg.arc().innerRadius(0).outerRadius(radius+10));
            svg.append("text")
              .attr("transform", function() {
                   return "translate(" + arc.centroid(d) + ")";
              		})
              .style("text-anchor", "middle")
              .attr("font-size", 20)
              .attr("id", "temp_text")
              .attr("fill","black")
              .attr("font-family","sans-serif")
              .style("opacity",100)
              .text(parseInt(d.value));

        })
        .on('mouseout', function() {
            d3.select(this).attr('d', d3.svg.arc().innerRadius(0).outerRadius(radius));
            svg.select("#temp_text").remove();
        });

    svg.on("click",function(){
    	create_forced()
	});

}

function createFD(array, bin) {

	var svg = d3.select("svg");
	svg.selectAll('*').remove();

	var margin = {top: 100, right: 10, bottom: 100, left: 400},
    width = 1500 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom,
    dist = 50;

    var array = d3.layout.histogram().bins(bin)(array);
      
	var nodes = [];

	for(var i=0;i<array.length;i++) {
		var node = {};
		node.name = array[i].length;
		nodes.push(node);
	}

	var links = [];

	for(var i=0;i<2*array.length;i++) {
		var link = {};
		link.source = parseInt(Math.random()*array.length);
		link.target = parseInt(Math.random()*array.length);
		links.push(link);
	}


	var dataset = {};
	dataset.nodes = nodes;
	dataset.links = links;


	var svg = svg.attr("width", width)
				.attr("height", height);

	var force = d3.layout.force()
					.links(dataset.links)
					.nodes(dataset.nodes)
					.size([width, height])
					.linkDistance([dist])        
					.charge([-200])            
					.start();

	var nodes = svg.selectAll("circle")
					.data(dataset.nodes)
					.enter()
					.append("circle")
					.attr("r", function(d) {
						return Math.sqrt(+(d.name));
					})
					.style("fill", function(d, i) {
						return color(i);
					})
					.call(force.drag)
					.on("click",function(){
						create_bar();
					});
      
	var lines = svg.selectAll("line")
				.data(dataset.links)
				.enter()
				.append("line");

	force.on("tick", function() {
		lines.attr("x1", function(d) { return d.source.x; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("y2", function(d) { return d.target.y; })
			.attr("stroke", "black");

		nodes.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

		});

}

function activatebinCount() {
	console.log("I entered");
  d3.select("#binCountUpdate").on("mousedown", function() {

    var div = d3.select(this)
    .classed("active", true);

    var xPos = d3.mouse(div.node())[0]
    var w = d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", function(){
      div.classed("active", false);
      w.on("mousemove", null).on("mouseup", null);
    });

    function mousemove() {
      if(d3.mouse(div.node())[0]+3 < xPos && bin > 1){
        bin -= 1;
        if(bar){
        	create_bar();
        }
        else if(pie){
        	create_pie();
        }
        else{
        	create_forced();
        }
        xPos = d3.mouse(div.node())[0];
      }
      else if(d3.mouse(div.node())[0]-3 > xPos && bin < 40){
        bin += 1;
        if(bar){
        	create_bar();
        }
        else if(pie){
        	create_pie();
        }
        else{
        	create_forced();
        }
        xPos = d3.mouse(div.node())[0];
      }
      document.getElementById("binsCount").innerHTML = bin;
    }
  }); 
}



