import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Variants, motion } from "motion/react";
import type { Team } from "../backend.d";
import { ErrorMessage } from "../components/ErrorMessage";
import { CardsSkeleton } from "../components/LoadingSkeleton";
import { useTeams } from "../hooks/useQueries";

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.07 } },
};
const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function TeamsPage() {
  const { data: teams, isLoading, isError } = useTeams();

  // Group teams by division
  const divisionMap: Record<string, Team[]> = {};
  for (const team of teams ?? []) {
    if (!divisionMap[team.division]) divisionMap[team.division] = [];
    divisionMap[team.division]!.push(team);
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-navy-mid border-b border-border/40">
        <div className="bg-field-pattern absolute inset-0 opacity-20" />
        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-orange-DEFAULT rounded-full" />
              <span className="text-xs font-ui font-bold uppercase tracking-[0.2em] text-orange-DEFAULT">
                NFFL 2026
              </span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight text-white">
              Teams
            </h1>
            <p className="text-muted-foreground mt-2 font-body">
              All {teams?.length ?? 16} teams competing in the National Flag
              Football League
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <CardsSkeleton count={8} />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <div className="space-y-12">
            {Object.entries(divisionMap)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([division, divTeams]) => (
                <div key={division}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1.5 bg-orange-DEFAULT rounded-full" />
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                      {division}
                    </h2>
                    <span className="text-muted-foreground text-sm font-ui">
                      ({divTeams.length} teams)
                    </span>
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  >
                    {divTeams.map((team) => (
                      <motion.div key={team.id.toString()} variants={fadeUp}>
                        <TeamCard team={team} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  return (
    <Card className="bg-card border-border card-glow card-glow-hover transition-all overflow-hidden group">
      {/* Color accent top strip */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${team.colors.primary}, ${team.colors.secondary})`,
        }}
      />
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Team color badge */}
          <div
            className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ring-2 ring-border group-hover:ring-orange-muted/50 transition-all"
            style={{
              background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})`,
            }}
          >
            <span className="font-display font-black text-lg text-white drop-shadow">
              {team.name.charAt(0)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-ui text-muted-foreground uppercase tracking-wider truncate">
              {team.city}
            </p>
            <h3 className="font-display font-black text-lg leading-tight text-foreground truncate">
              {team.name}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs bg-secondary/50 border-border font-ui"
              >
                {team.division}
              </Badge>
            </div>
          </div>
        </div>

        {/* Record */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "W", value: Number(team.wins) },
            { label: "L", value: Number(team.losses) },
            { label: "T", value: Number(team.ties) },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display font-black text-xl text-foreground">
                {stat.value}
              </div>
              <div className="text-xs font-ui uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <span
            className={`text-xs font-ui font-bold ${Number(team.wins) > Number(team.losses) ? "text-green-400" : Number(team.wins) < Number(team.losses) ? "text-red-400" : "text-muted-foreground"}`}
          >
            {Number(team.wins) > Number(team.losses)
              ? "▲ Above .500"
              : Number(team.wins) < Number(team.losses)
                ? "▼ Below .500"
                : "— At .500"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
