var apiKey = '344d4b334ad5ccdeb595ca6505104d97';
var rootURL = 'https://ws.audioscrobbler.com/2.0/';
var downloaded = [];
var week2 = [];
var account = "ianmroberts";

dates = getWeek(0)
console.log(dates)

var Graph = new D3_BubbleGraph("#graph")

getTracks(account,downloaded,dates[0],dates[1],1)

//getTracks(account,downloaded,moment("2017-12-16"),moment("2017-12-22"),1)
