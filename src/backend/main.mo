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
};
