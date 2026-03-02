import { useQuery } from "@tanstack/react-query";
import type { Game, NewsPost, Standing, Team } from "../backend.d";
import { useActor } from "./useActor";

const ALLOWED_TEAM_IDS = new Set(["1", "2"]);

export function useTeams() {
  const { actor, isFetching } = useActor();
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      if (!actor) return [];
      const teams = await actor.getTeams();
      return teams.filter((t) => ALLOWED_TEAM_IDS.has(t.id.toString()));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTeam(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Team>({
    queryKey: ["team", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getTeam(id);
    },
    enabled: !!actor && !isFetching,
  });
}

function filterGames(games: Game[]): Game[] {
  return games.filter(
    (g) =>
      ALLOWED_TEAM_IDS.has(g.homeTeamId.toString()) &&
      ALLOWED_TEAM_IDS.has(g.awayTeamId.toString()),
  );
}

export function useUpcomingGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games", "upcoming"],
    queryFn: async () => {
      if (!actor) return [];
      return filterGames(await actor.getUpcomingGames());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCompletedGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games", "completed"],
    queryFn: async () => {
      if (!actor) return [];
      return filterGames(await actor.getCompletedGames());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return filterGames(await actor.getGames());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStandings() {
  const { actor, isFetching } = useActor();
  return useQuery<Standing[]>({
    queryKey: ["standings"],
    queryFn: async () => {
      if (!actor) return [];
      const standings = await actor.getStandings();
      return standings.filter((s) => ALLOWED_TEAM_IDS.has(s.teamId.toString()));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsPost[]>({
    queryKey: ["news"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNewsPost(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsPost>({
    queryKey: ["news", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getNewsPost(id);
    },
    enabled: !!actor && !isFetching && id > 0n,
  });
}
