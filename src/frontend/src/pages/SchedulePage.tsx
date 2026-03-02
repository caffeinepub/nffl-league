import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin } from "lucide-react";
import { type Variants, motion } from "motion/react";
import type { Game } from "../backend.d";
import { GameStatus } from "../backend.d";
import { ErrorMessage } from "../components/ErrorMessage";
import { CardsSkeleton } from "../components/LoadingSkeleton";
import {
  useCompletedGames,
  useTeams,
  useUpcomingGames,
} from "../hooks/useQueries";

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function groupByWeek(games: Game[]): [string, Game[]][] {
  const map: Record<number, Game[]> = {};
  for (const g of games) {
    const week = Number(g.week);
    if (!map[week]) map[week] = [];
    map[week].push(g);
  }
  return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b));
}

export function SchedulePage() {
  const {
    data: upcoming,
    isLoading: upcomingLoading,
    isError: upcomingError,
  } = useUpcomingGames();
  const {
    data: completed,
    isLoading: completedLoading,
    isError: completedError,
  } = useCompletedGames();

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
              Schedule
            </h1>
            <p className="text-muted-foreground mt-2 font-body">
              Full season schedule for the 2026 NFFL season
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="upcoming">
          <TabsList className="bg-secondary border border-border mb-8">
            <TabsTrigger
              value="upcoming"
              className="font-ui font-semibold uppercase tracking-wide data-[state=active]:bg-orange-DEFAULT data-[state=active]:text-navy"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="font-ui font-semibold uppercase tracking-wide data-[state=active]:bg-orange-DEFAULT data-[state=active]:text-navy"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingLoading ? (
              <CardsSkeleton count={6} />
            ) : upcomingError ? (
              <ErrorMessage />
            ) : !upcoming?.length ? (
              <EmptyState message="No upcoming games scheduled." />
            ) : (
              <WeeklyGameGrid games={upcoming} showScores={false} />
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedLoading ? (
              <CardsSkeleton count={6} />
            ) : completedError ? (
              <ErrorMessage />
            ) : !completed?.length ? (
              <EmptyState message="No completed games yet." />
            ) : (
              <WeeklyGameGrid games={completed} showScores={true} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function WeeklyGameGrid({
  games,
  showScores,
}: { games: Game[]; showScores: boolean }) {
  const grouped = groupByWeek(games);

  return (
    <div className="space-y-10">
      {grouped.map(([week, weekGames]) => (
        <div key={week}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-5 w-1.5 bg-orange-DEFAULT rounded-full" />
            <h2 className="font-display font-black text-xl uppercase tracking-tight">
              Week {week}
            </h2>
            <span className="text-muted-foreground text-sm font-ui">
              {weekGames.length} {weekGames.length === 1 ? "game" : "games"}
            </span>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {weekGames.map((game) => (
              <motion.div key={game.id.toString()} variants={fadeUp}>
                <GameCard game={game} showScores={showScores} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function GameCard({ game, showScores }: { game: Game; showScores: boolean }) {
  const { data: teams } = useTeams();
  const homeTeam = teams?.find((t) => t.id === game.homeTeamId);
  const awayTeam = teams?.find((t) => t.id === game.awayTeamId);

  const homeScore =
    game.homeScore !== undefined ? Number(game.homeScore) : null;
  const awayScore =
    game.awayScore !== undefined ? Number(game.awayScore) : null;

  const homeWon =
    homeScore !== null && awayScore !== null && homeScore > awayScore;
  const awayWon =
    homeScore !== null && awayScore !== null && awayScore > homeScore;

  return (
    <Card className="bg-card border-border card-glow overflow-hidden">
      <CardContent className="p-0">
        {/* Status header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-secondary/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-ui">
            <Calendar size={12} />
            <span>{game.date}</span>
            <Clock size={12} className="ml-1" />
            <span>{game.time}</span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-ui uppercase tracking-wide ${
              game.status === GameStatus.completed
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : game.status === GameStatus.inProgress
                  ? "bg-orange-DEFAULT/10 text-orange-DEFAULT border-orange-muted/30 animate-pulse"
                  : "bg-secondary text-muted-foreground border-border"
            }`}
          >
            {game.status === GameStatus.inProgress ? "LIVE" : game.status}
          </Badge>
        </div>

        {/* Teams */}
        <div className="px-4 py-4">
          {/* Away Team */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full ring-2 ring-border flex-shrink-0"
                style={{ backgroundColor: awayTeam?.colors.primary ?? "#444" }}
              />
              <div>
                <span className="text-xs text-muted-foreground font-ui uppercase tracking-wider">
                  Away
                </span>
                <div
                  className={`font-display font-bold text-base leading-tight ${awayWon ? "text-orange-DEFAULT" : "text-foreground"}`}
                >
                  {awayTeam ? `${awayTeam.city} ${awayTeam.name}` : "TBD"}
                </div>
              </div>
            </div>
            {showScores && awayScore !== null && (
              <span
                className={`font-display font-black text-2xl ${awayWon ? "text-orange-DEFAULT" : "text-foreground/70"}`}
              >
                {awayScore}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs font-ui font-bold text-muted-foreground/50 uppercase tracking-widest">
              vs
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full ring-2 ring-border flex-shrink-0"
                style={{ backgroundColor: homeTeam?.colors.primary ?? "#444" }}
              />
              <div>
                <span className="text-xs text-muted-foreground font-ui uppercase tracking-wider">
                  Home
                </span>
                <div
                  className={`font-display font-bold text-base leading-tight ${homeWon ? "text-orange-DEFAULT" : "text-foreground"}`}
                >
                  {homeTeam ? `${homeTeam.city} ${homeTeam.name}` : "TBD"}
                </div>
              </div>
            </div>
            {showScores && homeScore !== null && (
              <span
                className={`font-display font-black text-2xl ${homeWon ? "text-orange-DEFAULT" : "text-foreground/70"}`}
              >
                {homeScore}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="px-4 pb-3 flex items-center gap-2 text-xs text-muted-foreground font-ui">
          <MapPin size={11} />
          <span>{game.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Calendar className="h-12 w-12 text-muted-foreground/30" />
      <p className="text-muted-foreground font-ui">{message}</p>
    </div>
  );
}
