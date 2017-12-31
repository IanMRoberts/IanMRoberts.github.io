var apiKey = '344d4b334ad5ccdeb595ca6505104d97';
var rootURL = 'https://ws.audioscrobbler.com/2.0/';

function Go(){
  if (document.getElementById("UserName").value == ""){
    console.log("Please enter a user name")
  }
  else {
    if (document.getElementById("graph")){
      console.log("Bubble Graph exists")
      var elem = document.getElementById("graph")
      elem.parentNode.removeChild(elem);
    }
    if (document.getElementById("BarGraph")){
      console.log("Bar Graph exists")
      var elem = document.getElementById("BarGraph")
      elem.parentNode.removeChild(elem);
    }
  var W = $(window).width()-100
  var H = $(window).height()
  d3.select("body")
    .append("div")
    .attr("id","graph")
    .style("height",H)
    .style("width",Math.floor(W*3/4))
    .style("float","left");
  d3.select("body")
    .append("div")
    .attr("id","BarGraph")
    .style("height",H)
    .style("width",Math.floor(W*1/4))
    .style("float","left");
  d3.select("#ToolTip")
    .style("width",Math.floor(W*3/4));

  Graph = new D3_BubbleGraph("#graph")
  downloaded = [];

  dates = [moment(document.getElementById("StartDate").value),moment(document.getElementById("EndDate").value)]
  getTracks(document.getElementById("UserName").value,downloaded,dates[0],dates[1],1)
  }
}

function Search() {
  SearchTerm = document.getElementById("SearchInput").value;

  temp = []; // list of all values that contain a match
  for (i = 0; i < Graph.Elements.length; i++) {
    if (Graph.Elements[i].Label.toLowerCase().indexOf(SearchTerm.toLowerCase()) > -1) {
      temp.push(Graph.Elements[i]); // push Element if it has a match
    }
  }
  // sort matches alphabetically
  temp.sort(function(a,b){
    var textA = a.Label.toLowerCase();
    var textB = b.Label.toLowerCase();
    if (textA.indexOf(SearchTerm.toLowerCase()) <= textB.indexOf(SearchTerm.toLowerCase())) {
      return 0;
    } else {
      return 1;
    }
  })
  BestMatch = temp[0];
  
  Graph.Search(BestMatch.Label);
}
