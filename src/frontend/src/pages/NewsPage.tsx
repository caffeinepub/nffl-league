import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, User } from "lucide-react";
import { type Variants, motion } from "motion/react";
import type { NewsCategory } from "../backend.d";
import { ErrorMessage } from "../components/ErrorMessage";
import { CardsSkeleton } from "../components/LoadingSkeleton";
import { useNews } from "../hooks/useQueries";

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
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function NewsPage() {
  const { data: news, isLoading, isError } = useNews();

  const featured = news?.[0];
  const rest = news?.slice(1) ?? [];

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
              News
            </h1>
            <p className="text-muted-foreground mt-2 font-body">
              Latest news, recaps, and announcements from the NFFL
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <CardsSkeleton count={6} />
        ) : isError ? (
          <ErrorMessage />
        ) : !news?.length ? (
          <div className="text-center py-20 text-muted-foreground font-ui">
            No news articles available.
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Article */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link to="/news/$id" params={{ id: featured.id.toString() }}>
                  <Card className="bg-card border-border card-glow overflow-hidden group cursor-pointer hover:border-orange-muted/50 transition-all">
                    <CardContent className="p-0">
                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge
                            variant="outline"
                            className={`${categoryColors[featured.category]} font-ui uppercase tracking-wide text-xs`}
                          >
                            {categoryLabels[featured.category]}
                          </Badge>
                          <span className="text-xs text-orange-DEFAULT font-ui font-semibold uppercase tracking-wider">
                            Featured
                          </span>
                        </div>
                        <h2 className="font-display font-black text-2xl md:text-3xl leading-tight text-foreground group-hover:text-orange-DEFAULT transition-colors mb-3">
                          {featured.title}
                        </h2>
                        <p className="text-muted-foreground font-body leading-relaxed line-clamp-3 mb-5">
                          {featured.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-ui">
                            <div className="flex items-center gap-1.5">
                              <User size={13} />
                              <span>{featured.author}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} />
                              <span>{formatDate(featured.publishedDate)}</span>
                            </div>
                          </div>
                          <span className="text-orange-DEFAULT font-ui font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read more <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Rest of articles */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-6 w-1.5 bg-blue-400 rounded-full" />
                  <h2 className="font-display font-black text-xl uppercase tracking-tight">
                    More Stories
                  </h2>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {rest.map((post) => (
                    <motion.div key={post.id.toString()} variants={fadeUp}>
                      <Link to="/news/$id" params={{ id: post.id.toString() }}>
                        <Card className="bg-card border-border card-glow card-glow-hover h-full overflow-hidden group cursor-pointer">
                          <CardContent className="p-5 h-full flex flex-col">
                            <Badge
                              variant="outline"
                              className={`${categoryColors[post.category]} font-ui uppercase tracking-wide text-xs self-start mb-3`}
                            >
                              {categoryLabels[post.category]}
                            </Badge>
                            <h3 className="font-display font-bold text-base leading-snug text-foreground group-hover:text-orange-DEFAULT transition-colors mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground font-body line-clamp-3 flex-1 mb-4">
                              {post.content}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground font-ui pt-3 border-t border-border/50">
                              <div className="flex items-center gap-1.5">
                                <User size={11} />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar size={11} />
                                <span>{formatDate(post.publishedDate)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
