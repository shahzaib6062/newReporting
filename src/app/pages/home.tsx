import { useEffect, useState, useRef, useCallback } from "react";
import ArticleCard from "../components/ArticleCard";
import Loader from "../components/Loader";
import { Article } from "../types/Article";
import { motion } from "framer-motion";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastArticleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log("👀 Bottom reached. Loading next page...");
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    fetchAllNews(page, page > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchAllNews = async (pageNum = 1, shouldAppend = false) => {
    setLoading(true);
    console.log("📦 Fetching page:", pageNum);

    const sources = JSON.parse(localStorage.getItem("preferredSources") || "[]");
    const query = localStorage.getItem("preferredQuery") || "";
    const category = localStorage.getItem("preferredCategory") || "";

    const fetchIfAllowed = async (sourceKey: string, endpoint: string) => {
      if (sources.length === 0 || sources.includes(sourceKey)) {
        const params = new URLSearchParams({
          query,
          page: pageNum.toString(),
          ...(category && { category }),
        });
        const response = await fetch(`/api/${endpoint}?${params}`);
        if (response.ok) {
          return await response.json();
        }
      }
      return [];
    };

    const [
      newsApiResults,
      guardianResults,
      mediastackResults,
      currentsResults,
      gnewsResults,
    ] = await Promise.all([
      fetchIfAllowed("newsapi", "newsapi"),
      fetchIfAllowed("guardian", "guardianapi"),
      fetchIfAllowed("mediastack", "mediastackapi"),
      fetchIfAllowed("currents", "currentsapi"),
      fetchIfAllowed("gnews", "gnewsapi"),
    ]);

    const combined = [
      ...newsApiResults,
      ...guardianResults,
      ...mediastackResults,
      ...currentsResults,
      ...gnewsResults,
    ];

    setArticles((prev) => (shouldAppend ? [...prev, ...combined] : combined));
    setLoading(false);
  };

  useEffect(() => {
    if (!articles.length) {
      setPage(1);
    }
  }, [articles.length]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <section>
        {/* Initial Loader */}
        {loading && articles.length === 0 && <Loader />}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {articles.map((article, idx) => {
              const isLast = idx === articles.length - 1;
              return isLast ? (
                <motion.div
                  key={idx}
                  ref={lastArticleRef}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ) : (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          !loading && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
              No articles found.
            </p>
          )
        )}

        {/* Scroll Loader */}
        {loading && articles.length > 0 && (
          <div className="mt-10">
            <Loader message="Loading more articles..." />
          </div>
        )}
      </section>
    </main>
  );
}
