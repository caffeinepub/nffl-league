import { useQuery } from "@tanstack/react-query";
import type { Game, NewsPost, Standing, Team } from "../backend.d";
import { useActor } from "./useActor";

export function useTeams() {
  const { actor, isFetching } = useActor();
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeams();
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

export function useUpcomingGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games", "upcoming"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingGames();
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
      return actor.getCompletedGames();
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
      return actor.getGames();
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
      return actor.getStandings();
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
