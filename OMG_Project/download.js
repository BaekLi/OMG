// JavaScript Document
$(document).ready(function() {
     "use strict";
     var mo = {
         init: function() {
             $('.download').click(function() {
                 var data = $('#txt').val();
				 var data1 = $('#txt1').val();
				 var data2 = $('#txt2').val();
                 if (data === '[]'||data1 === '[]'||data2=='[]') {
                     return;
                 }
                 mo.JSONToCSVConvertor(data,data1,data2,true);
             });
         },
         JSONToCSVConvertor: function(JSONData,Data1,Data2,ShowLabel) {
             var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
			 var arrData1 = typeof Data1 !== 'object' ? JSON.parse(Data1) : Data1;
			 var arrData2 = typeof Data2 !== 'object' ? JSON.parse(Data2) : Data2;
			 var CSV = '';
             if (ShowLabel) {
                 var row = "";
				row+='keyname,g1,g2,category,detail\r\n';
				 CSV+=row;
             }
             for (var i = 0; i < arrData1.length; i++) {
                 var row = "";
                 for (var index in arrData1[i]) {
					 var arrValueC =arrData[i][index].category== null ? "" : arrData[i][index].category ;
					 //var arrValueC =arrData[i][index].tissue== null ? "" : arrData[i][index].tissue ;
					 
					 var arrValueD =arrData[i][index].detail == null ? "" :  arrData[i][index].detail  ;
					 
					 var arrValue1 = arrData1[i][index] == null ? "" :  arrData1[i][index]  ;
					 
					 var arrValue2 = arrData2[i][index] == null ? "" : arrData2[i][index] ;
					 
					 if(arrValueC==null||arrValueD==null||arrValue1==null||arrValue2==null) return;
					 
					 row+= index+','+arrValue1 + ','+arrValue2+ ','+arrValueC + ','+arrValueD+ '\r\n';
                 }
                 CSV += row;
             }
             if (CSV == '') {
                 growl.error("Invalid data");
                 return;
             }
			 
			 document.getElementById("upload").style.display = "none";
			 document.getElementById("scatter").style.display = "block";
			 
			 document.getElementById("Relat").style.display = "block";
			 
			 // showScatter
			 mo.paint(CSV);
			 mo.calculate(CSV);
         },
		 paint: function(csvtxt){
			var margin = {top: 100, right: 300, bottom: 100, left: 200},
				width = document.body.clientWidth - margin.left - margin.right,
				height = window.innerHeight - margin.top - margin.bottom;

			// setup x 

			var xValue = function(d) { return d.g1;}, // data -> value
				xScale = d3.scale.linear().range([0, width]), // value -> display
				xMap = function(d) { return xScale(xValue(d));}, // data -> display
				xAxis =d3.svg.axis().scale(xScale).orient("bottom");

			// setup y
			var yValue = function(d) { return d.g2;}, // data -> value
				yScale = d3.scale.linear().range([height, 0]), // value -> display
				yMap = function(d) { return yScale(yValue(d));}, // data -> display
				yAxis = d3.svg.axis().scale(yScale).orient("left");

			// setup fill color
			var cValue = function(d) { return d.category;},
			//var cValue = function(d) { return d.tissue;},
				color = d3.scale.category10();

			// add the graph canvas to the body of the webpage
			var svg = d3.select("#scatter").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			  .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// add the tooltip area to the webpage
			var tooltip = d3.select("#scatter").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

			//var test = "keyname,g1,g2,category,detail\nSample000001,3.573120222,3.963408561,Type9,TBA\nSample000002,4.097267131,5.907782723,Type1,TBA\nSample000003,1.679648961,1.982283032,Type6,TBA";

			var exps = d3.csv.parse(csvtxt,function(d){
				return{
					keyname:d.keyname,
					g1:d.g1,
					g2:d.g2,
					category:d.category,
					detail:d.detail
				};
			});
			xScale.domain([d3.min(exps, xValue)-1, d3.max(exps, xValue)+1]);
			yScale.domain([d3.min(exps, yValue)-1, d3.max(exps, yValue)+1]);
			// x-axis
			  svg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + height + ")")
				  .call(xAxis)
				.append("text")
				  .attr("class", "label")
				  .attr("x", width)
				  .attr("y", -6)
				  .style("text-anchor", "end")
				  .text("g1");

			  // y-axis
			  svg.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				.append("text")
				  .attr("class", "label")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("g2");

			  // draw dots
			  svg.selectAll(".dot")
				  .data(exps)
				.enter().append("circle")
				  .attr("class", function(d){return d.category})
				  .attr("r", 3.5)
				  .attr("cx", xMap)
				  .attr("cy", yMap)
				  .style("fill", function(d) { return color(cValue(d));}) 
				  .on("mouseover", function(d) {
					  tooltip.transition()
						   .duration(200)
						   .style("opacity", .9);
					  tooltip.html(d.keyname + "<br/> (" + xValue(d) 
						+ ", " + yValue(d) + ")"+ "<br/> " +d.category+"<br/>"+d.detail)
						   .style("left", (d3.event.pageX + 5) + "px")
						   .style("top", (d3.event.pageY - 28) + "px");
				  })
				  .on("mouseout", function(d) {
					  tooltip.transition()
						   .duration(500)
						   .style("opacity", 0);
				  });

			  // draw legend
			  var legend = svg.selectAll(".legend")
				  .data(color.domain())
				.enter().append("g")
				  .attr("class", "legend")
				  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			  // draw legend colored rectangles
			  legend.append("rect")
				 // .data(data)
				  .attr("x", width + 72)
				  .attr("width", 18)
				  .attr("height", 18)
				  .style("fill", color)
			 	  .on("click",function(d){
	  				  var current = d3.selectAll("."+d).style("opacity");
	    			  d3.selectAll("."+d).transition().style("opacity",current==1?0:1);
			  	  });


			  // draw legend text
			  legend.append("text")
				  .attr("x", width + 100)
				  .attr("y", 9)
				  .attr("dy", ".35em")
				  .style("text-anchor", "start")
				  .text(function(d) { return d;})
				  .on("click",function(d){
	  				  var current = d3.selectAll("."+d).style("opacity");
	    			  d3.selectAll("."+d).transition().style("opacity",current==1?0:1);
  	  		  	  });

			  },
			  calculate: function(csvtxt){
				var exps = d3.csv.parse(csvtxt,function(d){
				return{
					keyname:d.keyname,
					g1: parseFloat(d.g1),
					g2:parseFloat(d.g2),
					category:d.category,
					detail:d.detail
					};
				});
				var sample = function (category, g1, g2)
				{
					this.category = category;
					this.g1 = g1;
					this.g2 = g2;
					this.g11 = g1*g1;
					this.g22 = g2*g2;
					this.g12 = g1*g2;
					this.count = 1;
					this.corr = 0;
					this.pv = 0;
				}

				  var arr = [];
				  exps.forEach(function(d){
					  for(var i=0;i<arr.length;i++){
						 if(arr[i].category==d.category){
							  arr[i].g1 +=d.g1;
							  arr[i].g2 +=d.g2;
							  arr[i].g11 +=d.g1*d.g1;
							  arr[i].g22 +=d.g2*d.g2;
							  arr[i].g12 += d.g1*d.g2;
							  arr[i].count++;
							  break;
						  }
					  }
					  if(i==arr.length){
							  arr.push(new sample(d.category,d.g1,d.g2));
						  }else if(arr.length==0){
						  arr.push(new sample(d.category,d.g1,d.g2));
					  }
				  });
				  
				  for(var i=0;i<arr.length;i++){
					  console.log(arr[i]);
				  }
				  
    			  var tbody = document.createElement("tbody");
				  var tr = tbody.insertRow(0);
				  var str = new Array("Category","Count","Correlation coefficient","p-value");
				  for(var i=0;i<str.length;i++){
					  var th = document.createElement("th");
					  th.width=325;
					  th.height=50;
        			  th.innerHTML = str[i];
        			  tr.appendChild (th);
				  }
				  for(var j=0;j<arr.length;j++){
						  var tr = tbody.insertRow (tbody.rows.length);
						  var obj = arr[j];
						  arr[j].corr = (obj.count*obj.g12-obj.g1*obj.g2)/Math.sqrt((obj.count*obj.g11-obj.g1*obj.g1)*(obj.count*obj.g22-obj.g2*obj.g2));
						  tr.insertCell(tr.cells.length).innerHTML = obj.category;
						  tr.insertCell(tr.cells.length).innerHTML = obj.count;
						  tr.insertCell(tr.cells.length).innerHTML = obj.corr;
				  }
				  document.getElementById("tb").appendChild(tbody);
				  
			  },
			 main: function() {
				 mo.init();
			 }
     };
     mo.main();
 });







