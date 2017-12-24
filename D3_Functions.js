// main bubble graph function
function D3_BubbleGraph(Container){
  // graph properties
  this.Width = document.getElementById(Container.replace("#","")).offsetWidth; // width of svg
  this.Height = document.getElementById(Container.replace("#","")).offsetHeight; // height of svg
  this.SinkStrength = 0.02; // strength of the force pulling the bubbles to the center
  this.Elements = []; // where the data is stored
  this.maxRadius = 30 // maixmum radius of bubbles
  this.minRadius = 0.25 // minimum rdiues is equal to this * maxRadius
  this.BarGraphContainer = "#BarGraph"
  this.Tracks = [];

  this.RadiusScale
  this.L = 0; // used to scale the bubbles

  // the d3 force simulation
  this.simulation = d3.forceSimulation(this.Elements)
    // the forces puuling the bubbles to the center
    .force("xSink",d3.forceX(this.Width/2).strength(this.SinkStrength*this.Height/this.Width))
    .force("ySink",d3.forceY(this.Height/2).strength(this.SinkStrength*this.Width/this.Height));

  // create the SGV container
  this.svg = d3.select(Container)
    .append("svg")
    .attr("width",this.Width)
    .attr("height",this.Height)
    .append("g");
    //.attr("transform","translate("+this.Width/2+","+this.Height/2+")");

  this.BarGraph = d3.select(this.BarGraphContainer)
    .style("font-size", "30px")
    .style("font-family","verdana")
    .text("");

    this.defs = this.svg.append("defs")
};

// function that adds data to the graph
D3_BubbleGraph.prototype.AddData = function (Data,ValueId,LableId,useImage) {
  // check if the data has an image associated with it
  if (useImage) {
    ImageID = Data[LableId].toLowerCase().replace(/ /g,"-") // create the image ID
    // push the data to elements
    this.Elements.push({"Label":Data[LableId],"Value":Data[ValueId],"Url":Data.ImageUrl,"ImageID":ImageID});
    // create the image definition
    this.defs
      .append("pattern")
      .attr("id",ImageID)
      .attr("height","100%").attr("width","100%")
      .attr("patternContentUnits","objectBoundingBox")
      .append("image")
      .attr("height",1).attr("width",1)
      .attr("preserveAspectRatio","none")
      .attr("xlink:href", Data.ImageUrl);
  } else {
    // if no image assign a color and push the data to elements
    color = '#'+(Math.random()*0xFFFFFF<<0).toString(16)
    this.Elements.push({"Label":Data[LableId],"Value":Data[ValueId],"Color":color});
  };
};

// function for rerendering the graph
D3_BubbleGraph.prototype.Update = function (){
  // store local with and hights of the svg
  W = this.Width;
  H = this.Height;
  if (W >= H) {
    dim = H;
  } else {
    dim = W;
  }
  // L is a scalling factor used to scale the radius of the bubbles when theres lots of data
  this.L = this.Elements.length+1;

  // get the min and max of the data
  domain = d3.extent(this.Elements, function(d) { return d.Value; })
  // create the radius scale
  RadiusScale = d3.scaleLog().domain(domain).range([Math.floor(dim*this.minRadius/Math.sqrt(this.L)),Math.floor(dim/Math.sqrt(this.L))]);
  this.RadiusScale = RadiusScale;
  // add the bubbles
  this.Bubbles = this.svg.selectAll(".bubbles")
    .attr("r", function(d) {return RadiusScale(d.Value); } )
    .data(this.Elements)
    .enter()
    .append("circle")
    .attr("class","bubbles")
    .attr("r", function(d) {return RadiusScale(d.Value); } )
    .attr("fill",function(d) {
      if (typeof d.Url === 'undefined') {
        console.log(d.Color)
        return d.Color;
      } else {
        return "url(#" + d.ImageID + ")"
      }
    })
    .attr("cx", function(d) { return Math.floor(Math.random()*W); } )
    .attr("cy", function(d) { return Math.floor(Math.random()*W); } )
    // functions for tooltips and interaction
    .on("click", MouseClick(this))
    .on("mouseleave", function(d) {d3.select(this).attr("r",RadiusScale(d.Value));} );

    function MouseClick(GraphObj) {
     return function(d) {
       d3.select(this).attr("r",RadiusScale(domain[1]+100)).moveToFront();
       GraphObj.BarGraph.text(d.Label);
       ArtistSongs = SongPlayCount(d.Label,GraphObj.Tracks,0);
       D3_barGraph(ArtistSongs,"PlayCount","SongName",100,GraphObj.BarGraphContainer)
      };
   };
};

// function for updating the force simulation when new data is added
D3_BubbleGraph.prototype.Force = function () {
  W = this.Width;
  H = this.Height;
  RadiusScale = this.RadiusScale;

  this.Bubbles = this.svg.selectAll(".bubbles")
  // force peramaters
  this.simulation.stop();
  this.simulation.nodes(this.Elements).on("tick",ticked(this.Bubbles)).alpha(1).restart()
    .force("collide",d3.forceCollide(function(d) {return RadiusScale(d.Value)+3;}));

  function ticked(Bubbles) {
    return function() {
      Bubbles
        .attr("cx",function(d) {return d.x;})
        .attr("cy",function(d) {return d.y;})
    };
  };
}


function D3_barGraph(Data,ValueId,LableId,CanvasScale,Container){
  // get factors for scaling the graph to the page
  var W = document.getElementById(Container.replace("#","")).offsetWidth;
  var H = document.getElementById(Container.replace("#","")).offsetHeight-100;

  Domain = d3.extent(Data, function(d) { return d[ValueId]; })
  // create scales
  WidthScale = d3.scaleLinear()
                    .domain([0,Data.length])
                    .range([0,H]);
  if (WidthScale(1) > H/20) {
    WidthScale = d3.scaleLinear()
                      .domain([0,20])
                      .range([0,H]);
  }
  HightScale = d3.scaleLinear()
                      .domain([0,Domain[1]])
                      .range([0,W]);

  ColorScale = d3.scaleLinear()
                      .domain([0,Domain[1]])
                      .range(["darkred","red"]);

  // create the canvas
  var canvas = d3.select(Container)
                  .append("svg")
                  .attr("width",W)
                  .attr("height",H);
  // create the bars
  //canvas.selectAll("rect").data(Data).exit().remove()
  var bars = canvas.selectAll("rect")
                      .data(Data) // import the data into d3
                      .enter() // create place holders
                      .append("rect")

                      .attr("width",function(d){return HightScale(d[ValueId]);})
                      .attr("x",function(d){return 0;})

                      .attr("y",function(d,i){return WidthScale(i);})
                      .attr("height",WidthScale(1-0.1))

                      .attr("fill","#e2e2e2");

    var text = canvas.selectAll("text")
                        .data(Data) // import the data into d3
                        .enter() // create place holders
                        .append("text")
                        .text(function(d){return d[LableId];})

                        .attr("width",function(d){return HightScale(d[ValueId]);})
                        .attr("x",function(d){return 0;})

                        .attr("y",function(d,i){return WidthScale(i+0.6);})
                        .attr("height",WidthScale(1))
                        .style("font-size",function() { if (WidthScale(0.8) < 18) {return WidthScale(0.8)+"px";} else {return "18px";} })
                        .attr("fill","#050000");
};

// d3 function to bring elements to the front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
