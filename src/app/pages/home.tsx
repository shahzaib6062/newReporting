"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ArticleCard from "../components/ArticleCard";
import Loader from "../components/Loader";
import { Article } from "../types/Article";
import { motion } from "framer-motion";

export default function Home({ query, refreshKey }: { query: string; refreshKey: number }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  // Track latest query in ref to avoid stale closure
  const latestQueryRef = useRef(query);

  // Intersection observer for infinite scroll
  const lastArticleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  // Reset when query or preferences change
  useEffect(() => {
    latestQueryRef.current = query;
    setArticles([]);
    setPage(1);
  }, [query, refreshKey]);

  // Fetch whenever page changes
  useEffect(() => {
    fetchAllNews(latestQueryRef.current, page, page > 1);
  }, [page]);

  const fetchAllNews = async (
    queryStr: string,
    pageNum: number,
    shouldAppend: boolean
  ) => {
    setLoading(true);
    console.log("🔍 Fetching:", { query: queryStr, page: pageNum });

    const sources = JSON.parse(localStorage.getItem("preferredSources") || "[]");
    const categories = JSON.parse(localStorage.getItem("preferredCategories") || "[]");
    const category = categories.length > 0 ? categories.join(",") : "";

    const fetchIfAllowed = async (sourceKey: string, endpoint: string) => {
      if (sources.length === 0 || sources.includes(sourceKey)) {
        const params = new URLSearchParams({
          query: queryStr,
          page: pageNum.toString(),
          ...(category && { category }),
        });
        const response = await fetch(`/api/${endpoint}?${params}`);
        if (response.ok) return await response.json();
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

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <section>
        {loading && articles.length === 0 && <Loader />}

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
              return (
                <motion.div
                  key={idx}
                  ref={isLast ? lastArticleRef : null}
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

        {loading && articles.length > 0 && (
          <div className="mt-10">
            <Loader message="Loading more articles..." />
          </div>
        )}
      </section>
    </main>
  );
}
