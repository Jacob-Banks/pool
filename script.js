let ul = document.getElementById("teams");
let getplayers = "";
let teamsa = [];
let team = "";
let stats = [];
let fled = "";

var getTeams = function () {
  // format the github api url
  var apiUrl = "https://statsapi.web.nhl.com/api/v1/teams/";

  // make a get request to url
  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        team = data;
        for (let i = 0; i < team.teams.length - 1; i++) {
          // console.log(players.roster[i].person)
          teamsa.push({
            id: team.teams[i].id,
            team: team.teams[i].name,
            players: [],
          });

          var apiUrl2 =
            "https://statsapi.web.nhl.com/api/v1/teams/" +
            teamsa[i].id +
            "?expand=team.roster";

          // make a get request to url
          fetch(apiUrl2).then(function (response) {
            // request was successful
            if (response.ok) {
              response.json().then(function (data) {
                getplayers = data;
                for (
                  let x = 0;
                  x < getplayers.teams[0].roster.roster.length;
                  x++
                ) {
                  teamsa[i].players.push({
                    name: getplayers.teams[0].roster.roster[x].person.fullName,
                    id: getplayers.teams[0].roster.roster[x].person.id,
                    position:
                      getplayers.teams[0].roster.roster[x].position.type,
                  });
                }
              });
            }
          });
        }
        displayTeams();
        fetch("https://statsapi.web.nhl.com/api/v1/game/2020030325/boxscore")
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            fled = response.teams.home.players;
            for (i = 0; i < teamsa[12].players.length; i++) {
              let live = teamsa[12].players[i].id;
              live = `ID` + live;

              if (fled[live].stats.skaterStats !== undefined) {
                stats.push({
                  asssits: fled[live].stats.skaterStats.assists,
                  name: fled[live].person.fullName,
                  time: fled[live].stats.skaterStats.timeOnIce,
                });
              }
            }
          });
      });
    }
  });
};

var displayTeams = function () {
  for (let i = 0; i < teamsa.length; i++) {
    var li = document.createElement("LI");
    li.innerHTML = teamsa[i].team;
    li.setAttribute("id", `${i}`);
    ul.appendChild(li);
  }
  $(`li`).on("click", function () {
    console.log("hi" + " " + this.id);
    let alpha = this.id;
    var ulplayers = document.createElement("UL");
    ulplayers.setAttribute("id", `ul${alpha}`);
    let attach = document.getElementById(alpha);
    attach.appendChild(ulplayers);

    for (let i = 0; i < teamsa[this.id].players.length; i++) {
      const lia = document.createElement("li");

      lia.innerHTML = teamsa[this.id].players[i].name;

      $(`#ul${alpha}`).append(lia);
      console.log("playerss should show up");
    }
  });
};
getTeams();
