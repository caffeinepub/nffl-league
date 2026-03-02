import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, TrendingUp, Users, Zap } from "lucide-react";
import { type Variants, motion } from "motion/react";
import type { Game, NewsCategory } from "../backend.d";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  useNews,
  useStandings,
  useTeams,
  useUpcomingGames,
} from "../hooks/useQueries";

const categoryColors: Record<NewsCategory, string> = {
  teamNews: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  gameRecap: "bg-green-500/20 text-green-300 border-green-500/30",
  announcement:
    "bg-orange-DEFAULT/20 text-orange-DEFAULT border-orange-muted/30",
  leagueUpdate: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const categoryLabels: Record<NewsCategory, string> = {
  teamNews: "Team News",
  gameRecap: "Game Recap",
  announcement: "Announcement",
  leagueUpdate: "League Update",
};

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp);
  const date = ms > 1e12 ? new Date(ms / 1_000_000) : new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.1 } },
};
const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HomePage() {
  const { data: news, isError: newsError } = useNews();
  const { data: upcoming, isError: gamesError } = useUpcomingGames();
  const { data: teams } = useTeams();
  const { data: standings } = useStandings();

  const latestNews = news?.slice(0, 3) ?? [];
  const upcomingGames = upcoming?.slice(0, 3) ?? [];

  const totalTeams = teams?.length ?? 0;
  const totalGames =
    standings?.reduce((acc, s) => acc + Number(s.wins) + Number(s.losses), 0) ??
    0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[480px] md:h-[520px] diagonal-cut">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="NFFL Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-10 bg-orange-DEFAULT rounded-full" />
                <span className="text-xs font-ui font-bold uppercase tracking-[0.2em] text-orange-DEFAULT">
                  Season 2026
                </span>
              </div>
              <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight text-white mb-4">
                THE PREMIER
                <span className="block text-gradient-orange">
                  FLAG FOOTBALL
                </span>
                LEAGUE
              </h1>
              <p className="text-lg text-foreground/70 mb-8 max-w-lg font-body">
                Featuring elite flag football competition across divisions.
                Fast-paced, competitive, and pure athletic excellence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-orange-DEFAULT hover:bg-orange-bright text-navy font-ui font-bold uppercase tracking-wide"
                >
                  <Link to="/schedule">
                    View Schedule <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-foreground/30 text-foreground hover:bg-foreground/10 font-ui font-bold uppercase tracking-wide"
                >
                  <Link to="/teams">All Teams</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-orange-DEFAULT/10 border-y border-orange-DEFAULT/20"
      >
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: Users,
                label: "Active Teams",
                value: totalTeams || "2",
                color: "text-orange-DEFAULT",
              },
              {
                icon: Calendar,
                label: "Games Played",
                value: Math.floor(totalGames / 2) || "48",
                color: "text-blue-400",
              },
              {
                icon: TrendingUp,
                label: "Divisions",
                value: "4",
                color: "text-green-400",
              },
              { icon: Zap, label: "Season", value: "2026", color: "text-gold" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1"
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div
                  className={`font-display font-black text-3xl ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-ui uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main content grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Upcoming Games - 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-orange-DEFAULT rounded-full" />
                <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                  Upcoming Games
                </h2>
              </div>
              <Link
                to="/schedule"
                className="text-sm font-ui font-semibold text-orange-DEFAULT hover:text-orange-bright flex items-center gap-1 transition-colors"
              >
                Full Schedule <ArrowRight size={14} />
              </Link>
            </div>

            {gamesError ? (
              <ErrorMessage />
            ) : upcomingGames.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-ui">
                No upcoming games scheduled.
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                {upcomingGames.map((game) => (
                  <UpcomingGameCard key={game.id.toString()} game={game} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Latest News - 1 col */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-blue-400 rounded-full" />
                <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                  Latest News
                </h2>
              </div>
              <Link
                to="/news"
                className="text-sm font-ui font-semibold text-orange-DEFAULT hover:text-orange-bright flex items-center gap-1 transition-colors"
              >
                All News <ArrowRight size={14} />
              </Link>
            </div>

            {newsError ? (
              <ErrorMessage />
            ) : latestNews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-ui">
                No news available.
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-3"
              >
                {latestNews.map((post) => (
                  <motion.div key={post.id.toString()} variants={fadeUp}>
                    <Link to="/news/$id" params={{ id: post.id.toString() }}>
                      <Card className="bg-card border-border card-glow card-glow-hover transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <Badge
                            variant="outline"
                            className={`text-xs mb-2 ${categoryColors[post.category]}`}
                          >
                            {categoryLabels[post.category]}
                          </Badge>
                          <h3 className="font-ui font-semibold text-sm leading-snug text-foreground line-clamp-2 mb-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{post.author}</span>
                            <span>{formatDate(post.publishedDate)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-orange-DEFAULT/10 border-y border-orange-DEFAULT/20">
        <div className="bg-field-pattern absolute inset-0 opacity-30" />
        <div className="relative container mx-auto px-4 py-12 text-center">
          <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight mb-3">
            Check the <span className="text-gradient-orange">Standings</span>
          </h2>
          <p className="text-muted-foreground mb-6 font-body">
            See how your favorite team stacks up in the division race.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-orange-DEFAULT hover:bg-orange-bright text-navy font-ui font-bold uppercase tracking-wide"
          >
            <Link to="/standings">
              View Standings <TrendingUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function UpcomingGameCard({ game }: { game: Game }) {
  const { data: teams } = useTeams();
  const homeTeam = teams?.find((t) => t.id === game.homeTeamId);
  const awayTeam = teams?.find((t) => t.id === game.awayTeamId);

  return (
    <motion.div variants={fadeUp}>
      <Card className="bg-card border-border card-glow card-glow-hover transition-all">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className="text-xs bg-orange-DEFAULT/10 text-orange-DEFAULT border-orange-muted/30 font-ui uppercase tracking-wide"
            >
              Week {Number(game.week)}
            </Badge>
            <span className="text-xs text-muted-foreground font-ui">
              {game.date} · {game.time}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <TeamDisplay
              name={awayTeam?.name ?? "TBD"}
              city={awayTeam?.city ?? ""}
              colors={awayTeam?.colors}
              side="left"
            />
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-xl text-orange-DEFAULT/60">
                VS
              </span>
            </div>
            <TeamDisplay
              name={homeTeam?.name ?? "TBD"}
              city={homeTeam?.city ?? ""}
              colors={homeTeam?.colors}
              side="right"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span className="font-ui">{game.location}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TeamDisplay({
  name,
  city,
  colors,
  side,
}: {
  name: string;
  city: string;
  colors?: { primary: string; secondary: string };
  side: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-3 flex-1 ${side === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-border"
        style={{ backgroundColor: colors?.primary ?? "#333" }}
      />
      <div
        className={`min-w-0 ${side === "right" ? "items-end" : "items-start"} flex flex-col`}
      >
        <span className="font-display font-black text-base leading-tight truncate">
          {name}
        </span>
        <span className="text-xs text-muted-foreground font-ui truncate">
          {city}
        </span>
      </div>
    </div>
  );
}
