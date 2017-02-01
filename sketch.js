var apiKey = '344d4b334ad5ccdeb595ca6505104d97';
var rootURL = 'http://ws.audioscrobbler.com/2.0/';
var tracks = [];
var account = "ianmroberts";

// Get a list of tracks played in a given week
function getRecentTracks(user,from,to) {
  if (from && to) {
    from  = new Date(from);
    from = from.getTime;
    to  = new Date(to);
    to = to.getTime;
    $.getJSON(rootURL + '?method=user.getRecentTracks' + '&user=' + user
    + '&from=' + from + '&to=' + to + '&api_key=' + apiKey + '&format=json' + '&limit=200', RTData);
  } else if (from) {
    from  = new Date(from);
    from = from.getTime;
    $.getJSON(rootURL + '?method=user.getRecentTracks' + '&user=' + user
    + '&from=' + from + '&api_key=' + apiKey + '&format=json' + '&limit=200', RTData);
  } else if (to){
    to  = new Date(to);
    to = to.getTime;
    $.getJSON(rootURL + '?method=user.getRecentTracks' + '&user=' + user
    + '&to=' + to + '&api_key=' + apiKey + '&format=json' + '&limit=200', RTData);
  }else {
    $.getJSON(rootURL + '?method=user.getweeklytrackchart' + '&user=' + user
    + '&api_key=' + apiKey + '&format=json' + '&limit=200', RTData);
  }
}
// callback function for getWeeklyTrackChart
function RTData(data){
  for (i = 0; i< data.recenttracks.track.length; i++) {
  tracks.push(data.recenttracks.track[i]);
  }
}


// Get a list of tracks played in a given week
function getAllTracks(user,page) {
  // log the page currently being loaded
  console.log('page');
  console.log(page);

  // the callback function. this function will cal getAllTracks again if its not
  // at the final page.
  var callback = function(data) {
    // load the page attributes sent by last.fm
    var attr = data.recenttracks['@attr'];
    // check if were loading the final page
    //if (attr.page < attr.totalPages) {
    if (attr.page < 2) {
      // if its the first page don't push the first song as it could be
      // currently playing
      if (page = 1) {
        // push the tracks to the track list
        for (i = 1; i< data.recenttracks.track.length; i++) {
        tracks.push(data.recenttracks.track[i]);
        }
      } else {
        // push the tracks to the track list
        for (i = 0; i< data.recenttracks.track.length; i++) {
        tracks.push(data.recenttracks.track[i]);
        }
      }
      // if its not the final page call the function again. Hurray recursion!
      getAllTracks(user,parseInt(attr.page)+1);
    }
  }
  // the json query
  $.getJSON(rootURL + '?method=user.getRecentTracks' + '&user=' + user
  + '&limit=200'+ "&page=" + page + '&api_key=' + apiKey + '&format=json', callback);
}

// call the funcion on the first page
getAllTracks(account,1)

// once all the ajax calls are done do somthing with the final track list
$(document).ajaxStop(function(){
    tracks.sort(function(a,b){
      return a.date.uts - b.date.uts;
    })
    for (i = 0; i < tracks.length; i++) {
      // console.log("Name")
      // console.log(tracks[i].name)
      // console.log("Artist")
      // console.log(tracks[i].artist['#text'])
      var date = new Date(parseInt(tracks[i].date.uts*1000));
      // console.log(date.toString())
      // console.log("\n")
    }
    // console.log(tracks.length);
    // console.log(tracks)

    g = {nodes: [], edges: []};

    // Generate a random graph:
    for (i = 0; i < tracks.length; i++) {
      var exist = false;
      for (j = 0; j < g.nodes.length; j++) {
        if (tracks[i].artist.mbid == g.nodes[j].id){
          exist = true
          g.nodes[j].size++
        }
      }
      if (!exist) {
        g.nodes.push({
          id: tracks[i].artist.mbid,

          label: tracks[i].artist['#text'],

          x: Math.random(),

          y: Math.random(),

          size: 1,

          color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)

        });
      }
    }

    for (i = 0; i < tracks.length-1; i++) {

      g.edges.push({

        id: 'e' + i,

        source: tracks[i].artist.mbid,

        target: tracks[i+1].artist.mbid,

        size: 1,

        color: '#ccc'

      });
    }

    for (j = 0; j < g.nodes.length; j++) {
      r = (g.nodes[j].size)+Math.random()*40;
      var theta = Math.random()*2*3.14;
      g.nodes[j].x = r*Math.cos(theta);
      g.nodes[j].y = r*Math.sin(theta);
    }

    // Instantiate sigma:

    s = new sigma({

      graph: g,

      container: 'graph-container'

    });

});
