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
  QueryString = rootURL + '?method=user.getRecentTracks' + '&user=' + user
  + '&limit=1000'+"&from="+start.utc().unix()+"&to="+end.add(1, 'days').utc().unix()+"&page=" + page + '&api_key=' + apiKey + '&format=json';

  console.log(QueryString);
  // the json query
  $.getJSON(QueryString, callback);
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
    this.tags = [];
    this.listeners = -1;
    this.onTour = -1;
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
        if (typeof data.artist === 'undefined' || data.artist.image[Size]["#text"] == "") {
          Graph.AddData(Artist,"playcount","name",false);
          Graph.Update();
          Graph.Force();
        } else {
          //Artist.ImageUrl = data.artist.image[Size]["#text"];
          Artist.mbid = data.artist.mbid;
          Artist.listeners = data.artist.stats.listeners;
          Artist.onTour = data.artist.ontour;
          
          
          if (Artist.mbid) {
             const url = 'https://musicbrainz.org/ws/2/artist/' + Artist.mbid + '?inc=url-rels&fmt=json';
             console.log(url);
              fetch(url)
                  .then(res => res.json())
                  .then((out) => {
                      const relations = out.relations;
                      console.table(relations);
                      // Find image relation
                      for (let i = 0; i < relations.length; i++) {
                          if (relations[i].type === 'image') {
                              let image_url = relations[i].url.resource;
                              if (image_url.startsWith('https://commons.wikimedia.org/wiki/File:')) {
                                  const filename = image_url.substring(image_url.lastIndexOf('/') + 1);
                                  Artist.ImageUrl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + filename;
                              }
                              console.log(image_url);
                              success(image_url);
                          }
                      }
                  })
                  .catch(err => { throw console.log(err) });
          
          
          
          for (i = 0; i < data.artist.tags.tag.length; i++){
            Artist.tags.push(data.artist.tags.tag[i].name);
          }
          Graph.AddData(Artist,"playcount","name",true);
          Graph.Update();
          Graph.Force();
        };
      };
    };
    QueryString = rootURL + '?method=artist.getinfo' +"&artist="
    + Artists[i].name.replace(/&/g,"and") + '&api_key=' + apiKey + '&format=json';
    //console.log(QueryString);
    $.getJSON(QueryString,callback(Artists[i]));
  };
};

function dataLoaded(tracks) {
  artistStats = ArtistPlayCount(tracks);
  var Data = [];
  Graph.Tracks = tracks;
  GetImages(artistStats,2)
};
