import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { ErrorMessage } from "../components/ErrorMessage";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { useStandings, useTeams } from "../hooks/useQueries";

export function StandingsPage() {
  const { data: standings, isLoading, isError } = useStandings();
  const { data: teams } = useTeams();

  // Group standings by division
  const divisionMap: Record<string, typeof standings> = {};
  for (const s of standings ?? []) {
    if (!divisionMap[s.division]) divisionMap[s.division] = [];
    divisionMap[s.division]!.push(s);
  }

  // Sort each division by wins desc, then losses asc
  for (const div of Object.values(divisionMap)) {
    div?.sort((a, b) => {
      const wDiff = Number(b.wins) - Number(a.wins);
      if (wDiff !== 0) return wDiff;
      return Number(a.losses) - Number(b.losses);
    });
  }

  const getTeam = (teamId: bigint) => teams?.find((t) => t.id === teamId);

  const winPct = (w: bigint, l: bigint, t: bigint) => {
    const total = Number(w) + Number(l) + Number(t);
    if (total === 0) return ".000";
    const pct = (Number(w) + Number(t) * 0.5) / total;
    return pct === 1 ? "1.000" : pct.toFixed(3).replace("0.", ".");
  };

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
              Standings
            </h1>
            <p className="text-muted-foreground mt-2 font-body">
              2026 season standings grouped by division
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <ErrorMessage />
        ) : !standings?.length ? (
          <div className="text-center py-20 text-muted-foreground font-ui">
            No standings data available.
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(divisionMap)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([division, divStandings], divIndex) => (
                <motion.div
                  key={division}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: divIndex * 0.1, duration: 0.5 }}
                >
                  {/* Division Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-6 w-1.5 bg-orange-DEFAULT rounded-full" />
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                      {division}
                    </h2>
                    <TrendingUp className="h-5 w-5 text-muted-foreground/50" />
                  </div>

                  {/* Table */}
                  <div className="rounded-lg border border-border overflow-hidden bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 bg-secondary/50 hover:bg-secondary/50">
                          <TableHead className="w-10 text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground">
                            Rank
                          </TableHead>
                          <TableHead className="font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground">
                            Team
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground">
                            W
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground">
                            L
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground">
                            T
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground hidden sm:table-cell">
                            PCT
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground hidden md:table-cell">
                            PF
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground hidden md:table-cell">
                            PA
                          </TableHead>
                          <TableHead className="text-center font-ui font-bold uppercase tracking-wider text-xs text-muted-foreground hidden lg:table-cell">
                            DIFF
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {divStandings?.map((standing, idx) => {
                          const team = getTeam(standing.teamId);
                          const isFirst = idx === 0;
                          const diff =
                            Number(standing.pointsFor) -
                            Number(standing.pointsAgainst);

                          return (
                            <TableRow
                              key={standing.teamId.toString()}
                              className={`border-border/30 transition-colors ${
                                isFirst
                                  ? "bg-orange-DEFAULT/5"
                                  : idx % 2 === 0
                                    ? "bg-transparent"
                                    : "bg-secondary/20"
                              } hover:bg-secondary/40`}
                            >
                              <TableCell className="text-center">
                                <span
                                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-display font-black text-sm ${
                                    isFirst
                                      ? "bg-orange-DEFAULT text-navy"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {team && (
                                    <div
                                      className="w-8 h-8 rounded-full ring-1 ring-border flex-shrink-0"
                                      style={{
                                        background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})`,
                                      }}
                                    />
                                  )}
                                  <div>
                                    <div className="font-display font-bold text-sm text-foreground">
                                      {team
                                        ? `${team.city} ${team.name}`
                                        : `Team ${standing.teamId}`}
                                    </div>
                                    {isFirst && (
                                      <div className="text-xs text-orange-DEFAULT font-ui">
                                        Division Leader
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-display font-bold text-green-400">
                                {Number(standing.wins)}
                              </TableCell>
                              <TableCell className="text-center font-display font-bold text-red-400/80">
                                {Number(standing.losses)}
                              </TableCell>
                              <TableCell className="text-center font-display font-bold text-muted-foreground">
                                {Number(standing.ties)}
                              </TableCell>
                              <TableCell className="text-center font-ui font-semibold text-sm hidden sm:table-cell">
                                {winPct(
                                  standing.wins,
                                  standing.losses,
                                  standing.ties,
                                )}
                              </TableCell>
                              <TableCell className="text-center font-ui text-sm hidden md:table-cell">
                                {Number(standing.pointsFor)}
                              </TableCell>
                              <TableCell className="text-center font-ui text-sm hidden md:table-cell">
                                {Number(standing.pointsAgainst)}
                              </TableCell>
                              <TableCell className="text-center hidden lg:table-cell">
                                <span
                                  className={`font-display font-bold text-sm ${
                                    diff > 0
                                      ? "text-green-400"
                                      : diff < 0
                                        ? "text-red-400/80"
                                        : "text-muted-foreground"
                                  }`}
                                >
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Legend */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground font-ui">
                    <div className="w-3 h-3 rounded-sm bg-orange-DEFAULT/20" />
                    <span>Division Leader</span>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
