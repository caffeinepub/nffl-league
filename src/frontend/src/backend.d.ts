import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Team {
    id: TeamId;
    city: string;
    name: string;
    ties: bigint;
    wins: bigint;
    division: string;
    losses: bigint;
    colors: {
        secondary: string;
        primary: string;
    };
}
export interface Game {
    id: GameId;
    status: GameStatus;
    awayTeamId: TeamId;
    date: string;
    time: string;
    week: bigint;
    homeTeamId: TeamId;
    season: bigint;
    homeScore?: bigint;
    awayScore?: bigint;
    location: string;
}
export type Time = bigint;
export type GameId = bigint;
export interface Standing {
    pointsFor: bigint;
    ties: bigint;
    wins: bigint;
    conferenceRank: bigint;
    division: string;
    losses: bigint;
    pointsAgainst: bigint;
    teamId: TeamId;
}
export type NewsPostId = bigint;
export type TeamId = bigint;
export interface NewsPost {
    id: NewsPostId;
    title: string;
    content: string;
    publishedDate: Time;
    author: string;
    category: NewsCategory;
}
export enum GameStatus {
    upcoming = "upcoming",
    completed = "completed",
    inProgress = "inProgress"
}
export enum NewsCategory {
    teamNews = "teamNews",
    gameRecap = "gameRecap",
    announcement = "announcement",
    leagueUpdate = "leagueUpdate"
}
export interface backendInterface {
    addNewsPost(news: NewsPost): Promise<void>;
    addUpdateGame(game: Game): Promise<void>;
    addUpdateTeam(team: Team): Promise<void>;
    getCompletedGames(): Promise<Array<Game>>;
    getGames(): Promise<Array<Game>>;
    getNews(): Promise<Array<NewsPost>>;
    getNewsPost(id: NewsPostId): Promise<NewsPost>;
    getStandings(): Promise<Array<Standing>>;
    getTeam(id: TeamId): Promise<Team>;
    getTeamGames(teamId: TeamId): Promise<Array<Game>>;
    getTeams(): Promise<Array<Team>>;
    getUpcomingGames(): Promise<Array<Game>>;
    initialize(): Promise<void>;
}
