// d3 function to bring elements to the front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// main bubble graph function
function D3_BubbleGraph(Container){
  // graph properties
  this.Width = 1100; // width of svg
  this.Height = 900; // height of svg
  this.SinkStrength = 0.02; // strength of the force pulling the bubbles to the center
  this.Elements = []; // where the data is stored
  this.maxRadius = 30 // maixmum radius of bubbles
  this.minRadius = 0.25 // minimum rdiues is equal to this * maxRadius
  this.BarGraphContainer = "#BarGraph"

  this.RadiusScale
  this.L = 0; // used to scale the bubbles

  // the d3 force simulation
  this.simulation = d3.forceSimulation(this.Elements)
    // the forces puuling the bubbles to the center
    .force("xSink",d3.forceX(this.Width/2).strength(this.SinkStrength))
    .force("ySink",d3.forceY(this.Height/2).strength(this.SinkStrength*3));

  // create the SGV container
  this.svg = d3.select(Container)
    .append("svg")
    .attr("width",this.Width)
    .attr("height",this.Height)
    .append("g");
    //.attr("transform","translate("+this.Width/2+","+this.Height/2+")");

  this.BarGraph = d3.select(this.BarGraphContainer)
    .style("font-size", "30px")
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
  // L is a scalling factor used to scale the radius of the bubbles when theres lots of data
  this.L = this.Elements.length+1;
  while (Math.floor(H*this.maxRadius/this.L) > H/10){
    this.L += 30;
  };
  // get the min and max of the data
  domain = d3.extent(this.Elements, function(d) { return d.Value; })
  // create the radius scale
  RadiusScale = d3.scaleLog().domain(domain).range([Math.floor(H*this.maxRadius*this.minRadius/this.L),Math.floor(H*this.maxRadius/this.L)]);
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
       d3.select(this).attr("r",RadiusScale(domain[1]+2)).moveToFront();
       GraphObj.BarGraph.text(d.Label);
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

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

// Get a list of tracks played in a given week
function getTracks(user,tracks,start,end,page) {
  // the callback function. this function will cal getAllTracks again if its not
  // at the final page.
  var callback = function(data) {
    // load the page attributes sent by last.fm
    var attr = data.recenttracks['@attr'];

    // if its the first page don't push the first song as it could be
    // currently playing
    if (parseInt(attr.page) == 1) {
      // push the tracks to the track list
      for (i = 1; i < parseInt(data.recenttracks.track.length); i++) {
      tracks.push(data.recenttracks.track[i]);
      }
    } else {
      // push the tracks to the track list
      for (i = 0; i< parseInt(data.recenttracks.track.length); i++) {
      tracks.push(data.recenttracks.track[i]);
      }
    }
    if (parseInt(attr.page) == parseInt(attr.totalPages)) {
      //console.log(tracks);
      dataLoaded(tracks);
    }
    // check if were loading the final page
    if (parseInt(attr.page) < parseInt(attr.totalPages)) {
      // if its not the final page call the function again. Hurray recursion!
      getTracks(user,tracks,start,end,parseInt(attr.page)+1);
    }
  }
  console.log(rootURL + '?method=user.getRecentTracks' + '&user=' + user
  + '&limit=1000'+"&from="+start.unix()+"&to="+end.unix()+"&page=" + page + '&api_key=' + apiKey + '&format=json');
  // the json query
  $.getJSON(rootURL + '?method=user.getRecentTracks' + '&user=' + user
  + '&limit=1000'+"&from="+start.unix()+"&to="+end.unix()+"&page=" + page + '&api_key=' + apiKey + '&format=json', callback);
};

function getWeek(WeekNumber) {
  return [moment().add(-7*(WeekNumber+1), 'days'),moment().add(-7*WeekNumber, 'days')];
};

function ArtistPlayCount(tracks) {
  function Artist(Mbid,Name) {
    this.mbid = Mbid;
    this.name = Name;
    this.playcount = 1;
    this.ImageUrl = "";
  };

  var artistStats = [];
  var artistNames = [];
  for (i = 0; i < tracks.length; i++){
    name = tracks[i].artist["#text"];
    if (artistNames.includes(name) == false){
      artistStats.push(new Artist(tracks[i].artist.mbid,tracks[i].artist["#text"]));
      artistNames.push(name);
    } else {
      for (j = 0; j < artistStats.length; j++){
        if (artistStats[j].name == name){
          artistStats[j].playcount += 1;
        };
      };
    };
  };
  //console.log(artistStats);
  return artistStats;
};

function GetImages(Artists,Size) {
  if (Size < 0 || Size > 4) {
    console.log("image size must be between 0 and 4")
  }

  for (i = 0; i < Artists.length; i++) {
    // define the callback function
    function callback(Artist){
      return function(data) {
        if (typeof data.artist === 'undefined') {
          Graph.AddData(Artist,"playcount","name",false);
          Graph.Update();
          Graph.Force();
        } else {
          Artist.ImageUrl = data.artist.image[Size]["#text"];
          Artist.mbid = data.artist.mbid;

          Graph.AddData(Artist,"playcount","name",true);
          Graph.Update();
          Graph.Force();
        };
      };
    };

    $.getJSON(rootURL + '?method=artist.getinfo' +"&artist="
    + Artists[i].name + '&api_key=' + apiKey + '&format=json',callback(Artists[i]));
  };
};

function dataLoaded(tracks) {
  artistStats = ArtistPlayCount(tracks);
  var Data = [];
  GetImages(artistStats,2)
};
