import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { Team } from "../backend.d";
import { useActor } from "./useActor";

const GRANVILLE_TEAM: Team = {
  id: 1n,
  city: "Granville",
  name: "Granville",
  division: "East",
  wins: 0n,
  losses: 0n,
  ties: 0n,
  colors: { primary: "#2d7a2d", secondary: "#ffffff" },
};

const MARK_TEAM: Team = {
  id: 2n,
  city: "Mark",
  name: "Mark",
  division: "West",
  wins: 0n,
  losses: 0n,
  ties: 0n,
  colors: { primary: "#1a4d8f", secondary: "#f5a623" },
};

const DESIRED_TEAMS: Team[] = [GRANVILLE_TEAM, MARK_TEAM];

/**
 * Ensures Granville (East) and Mark (West) are seeded in the backend.
 * Always upserts both teams to ensure divisions are up to date.
 */
export function useTeamInit() {
  const { actor, isFetching } = useActor();
  const initialized = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!actor || isFetching || initialized.current) return;

    initialized.current = true;

    async function seedTeams() {
      if (!actor) return;
      try {
        // Always upsert both teams so division assignments stay correct
        await Promise.all(
          DESIRED_TEAMS.map((team) => actor.addUpdateTeam(team)),
        );
        queryClient.invalidateQueries({ queryKey: ["teams"] });
        queryClient.invalidateQueries({ queryKey: ["standings"] });
      } catch (err) {
        console.error("Failed to seed teams:", err);
        initialized.current = false;
      }
    }

    seedTeams();
  }, [actor, isFetching, queryClient]);
}
