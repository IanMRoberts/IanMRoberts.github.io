// Get a list of tracks played in a given week
function getTracks(user,tracks,start,end,page) {
  // the callback function. this function will cal getAllTracks again if its not
  // at the final page.
  var callback = function(data) {
    // load the page attributes sent by last.fm
    var attr = data.recenttracks['@attr'];

      // push the tracks to the track list
    for (i = 0; i< parseInt(data.recenttracks.track.length); i++) {
      if (parseInt(attr.page) == 1) {
        if (typeof data.recenttracks.track[i]['@attr'] !== 'undefined'){
          console.log(data.recenttracks.track[i]);
        } else {
          tracks.push(data.recenttracks.track[i]);
        };
      };
    };
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
    if ( !artistNames.includes(name) ){
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

function SongPlayCount(Artist,tracks,ImageSize) {
  var SongNames = [];
  var Songs = [];
  for (i = 0; i < tracks.length; i++){
    ArtistName = tracks[i].artist["#text"];
    if (ArtistName == Artist){
      Track = tracks[i];
      if ( !SongNames.includes(Track.name) ) {
        SongNames.push(Track.name)
        Songs.push({"SongName":Track.name,"PlayCount":1,"mbid":Track.mbid,"ImageUrl":Track.image[ImageSize]})
      } else {
        for (j = 0; j < Songs.length; j++){
          if (Songs[j].SongName == Track.name){
            Songs[j].PlayCount += 1;
          };
        };
      };
    };
  };
  return Songs;
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
  Graph.Tracks = tracks;
  GetImages(artistStats,2)
};
