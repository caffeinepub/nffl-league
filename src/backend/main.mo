import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  type TeamId = Nat;
  type GameId = Nat;
  type NewsPostId = Nat;

  type Team = {
    id : TeamId;
    name : Text;
    city : Text;
    colors : {
      primary : Text;
      secondary : Text;
    };
    division : Text;
    wins : Nat;
    losses : Nat;
    ties : Nat;
  };

  module Team {
    public func compare(team1 : Team, team2 : Team) : Order.Order {
      Nat.compare(team1.id, team2.id);
    };
  };

  type GameStatus = {
    #upcoming;
    #inProgress;
    #completed;
  };

  type Game = {
    id : GameId;
    homeTeamId : TeamId;
    awayTeamId : TeamId;
    date : Text;
    time : Text;
    location : Text;
    homeScore : ?Nat;
    awayScore : ?Nat;
    status : GameStatus;
    week : Nat;
    season : Nat;
  };

  module Game {
    public func compare(game1 : Game, game2 : Game) : Order.Order {
      Nat.compare(game1.id, game2.id);
    };
  };

  type NewsCategory = {
    #announcement;
    #gameRecap;
    #teamNews;
    #leagueUpdate;
  };

  type NewsPost = {
    id : NewsPostId;
    title : Text;
    content : Text;
    author : Text;
    publishedDate : Time.Time;
    category : NewsCategory;
  };

  module NewsPost {
    public func compareByDate(news1 : NewsPost, news2 : NewsPost) : Order.Order {
      Int.compare(news2.publishedDate, news1.publishedDate);
    };
  };

  type Standing = {
    teamId : TeamId;
    wins : Nat;
    losses : Nat;
    ties : Nat;
    pointsFor : Nat;
    pointsAgainst : Nat;
    division : Text;
    conferenceRank : Nat;
  };

  module Standing {
    public func compareByWins(standing1 : Standing, standing2 : Standing) : Order.Order {
      switch (Nat.compare(standing2.wins, standing1.wins)) {
        case (#equal) { Nat.compare(standing1.teamId, standing2.teamId) };
        case (order) { order };
      };
    };
  };

  let teamStore = Map.empty<TeamId, Team>();
  let gameStore = Map.empty<GameId, Game>();
  let newsStore = Map.empty<NewsPostId, NewsPost>();
  let standingStore = Map.empty<TeamId, Standing>();

  func initializeSampleData() {
    // Sample Teams
    let teams : [Team] = [
      // Division 1
      { id = 1; name = "Red Rockets"; city = "New York"; colors = { primary = "Red"; secondary = "White" }; division = "East"; wins = 5; losses = 2; ties = 1 },
      { id = 2; name = "Blue Bulls"; city = "Chicago"; colors = { primary = "Blue"; secondary = "Silver" }; division = "East"; wins = 4; losses = 3; ties = 1 },
      { id = 3; name = "Green Gators"; city = "Miami"; colors = { primary = "Green"; secondary = "Orange" }; division = "East"; wins = 6; losses = 1; ties = 1 },
      { id = 4; name = "Yellow Jackets"; city = "Boston"; colors = { primary = "Yellow"; secondary = "Black" }; division = "East"; wins = 3; losses = 5; ties = 0 },
      // Division 2
      { id = 5; name = "Purple Panthers"; city = "Los Angeles"; colors = { primary = "Purple"; secondary = "White" }; division = "West"; wins = 5; losses = 3; ties = 0 },
      { id = 6; name = "Orange Outlaws"; city = "Houston"; colors = { primary = "Orange"; secondary = "Black" }; division = "West"; wins = 4; losses = 4; ties = 0 },
      { id = 7; name = "Silver Sharks"; city = "San Francisco"; colors = { primary = "Silver"; secondary = "Blue" }; division = "West"; wins = 6; losses = 2; ties = 0 },
      { id = 8; name = "Black Bears"; city = "Seattle"; colors = { primary = "Black"; secondary = "Green" }; division = "West"; wins = 3; losses = 4; ties = 1 },
    ];

    for (team in teams.values()) {
      teamStore.add(team.id, team);
    };

    // Sample Games
    let games : [Game] = [
      { id = 1; homeTeamId = 1; awayTeamId = 2; date = "2023-10-01"; time = "15:00"; location = "New York"; homeScore = ?21; awayScore = ?14; status = #completed; week = 1; season = 2023 },
      { id = 2; homeTeamId = 3; awayTeamId = 4; date = "2023-10-01"; time = "17:00"; location = "Miami"; homeScore = ?17; awayScore = ?24; status = #completed; week = 1; season = 2023 },
      // ... more games
    ];

    for (game in games.values()) {
      gameStore.add(game.id, game);
    };

    // Sample Standings
    let standings : [Standing] = [
      { teamId = 1; wins = 5; losses = 2; ties = 1; pointsFor = 200; pointsAgainst = 150; division = "East"; conferenceRank = 1 },
      // ... more standings
    ];

    for (standing in standings.values()) {
      standingStore.add(standing.teamId, standing);
    };

    // Sample News Posts
    let newsPosts : [NewsPost] = [
      {
        id = 1;
        title = "Season Kickoff";
        content = "The 2023 NFFL season has officially started!";
        author = "Admin";
        publishedDate = Time.now();
        category = #announcement;
      },
      // ... more news posts
    ];

    for (news in newsPosts.values()) {
      newsStore.add(news.id, news);
    };
  };

  // Query Functions
  public query func getTeams() : async [Team] {
    teamStore.toArray().map(func((_, t)) { t });
  };

  public query func getTeam(id : TeamId) : async Team {
    switch (teamStore.get(id)) {
      case (null) { Runtime.trap("Team does not exist") };
      case (?team) { team };
    };
  };

  public query func getGames() : async [Game] {
    gameStore.toArray().map(func((_, g)) { g });
  };

  public query func getTeamGames(teamId : TeamId) : async [Game] {
    gameStore.values().toArray().filter(func(g) { g.homeTeamId == teamId or g.awayTeamId == teamId });
  };

  public query func getUpcomingGames() : async [Game] {
    gameStore.values().toArray().filter(func(g) { g.status == #upcoming });
  };

  public query func getCompletedGames() : async [Game] {
    gameStore.values().toArray().filter(func(g) { g.status == #completed });
  };

  public query func getStandings() : async [Standing] {
    standingStore.values().toArray().sort(Standing.compareByWins);
  };

  public query func getNews() : async [NewsPost] {
    newsStore.values().toArray().sort(NewsPost.compareByDate);
  };

  public query func getNewsPost(id : NewsPostId) : async NewsPost {
    switch (newsStore.get(id)) {
      case (null) { Runtime.trap("News post does not exist") };
      case (?news) { news };
    };
  };

  // Admin Functions
  public shared ({ caller }) func addUpdateTeam(team : Team) : async () {
    teamStore.add(team.id, team);
  };

  public shared ({ caller }) func addUpdateGame(game : Game) : async () {
    gameStore.add(game.id, game);
  };

  public shared ({ caller }) func addNewsPost(news : NewsPost) : async () {
    newsStore.add(news.id, news);
  };

  public shared ({ caller }) func initialize() : async () {
    initializeSampleData();
  };
};
