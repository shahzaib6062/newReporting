"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import ArticleCard from "../components/ArticleCard";
import Loader from "../components/Loader";
import FilterCard, { FilterValues } from "../components/FilterCard";
import { Article } from "../types/Article";

interface HomeProps {
  query: string;
  refreshKey: number;
  showFilters?: boolean;
  onCloseFilters?: () => void;
  filters?: FilterValues | null;
  onSaveFilters?: (filters: FilterValues) => void;
  onClearFilters?: () => void;
  preferredSources?: string[];
  preferredCategories?: string[];
}

export default function Home({
  query,
  refreshKey,
  showFilters,
  onCloseFilters,
  filters,
  onSaveFilters,
  onClearFilters,
  preferredSources = [],
  preferredCategories = [],
}: HomeProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const latestQueryRef = useRef(query);
  const latestFiltersRef = useRef<FilterValues | null>(filters || null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const SOURCE_KEY_MAP: Record<string, string> = {
    "NewsAPI": "newsapi",
    "The Guardian": "guardian",
    "Mediastack": "mediastack",
    "Currents API": "currents",
    "GNews API": "gnews"
  };

  const fetchAllNews = async (
    queryStr: string,
    pageNum: number,
    shouldAppend: boolean,
    filterVals: FilterValues | null
  ) => {
    setLoading(true);
    let sources: string[] = [];
    let category = "";
    let fromDate = "";
    let toDate = "";

    if (filterVals) {
      sources =
        filterVals.source && filterVals.source !== "All Sources"
          ? [SOURCE_KEY_MAP[filterVals.source] || filterVals.source]
          : [];
      category =
        filterVals.category && filterVals.category !== "All Categories"
          ? filterVals.category
          : "";
      fromDate = filterVals.fromDate;
      toDate = filterVals.toDate;
    } else {
      sources = preferredSources.map(src => SOURCE_KEY_MAP[src] || src);
      category = preferredCategories.length > 0 ? preferredCategories.join(",") : "";
    }

    const GNEWS_TOPICS = [
      "world", "nation", "business", "technology", "entertainment", "sports", "science", "health"
    ];
    const MEDIASTACK_CATEGORIES = [
      "business", "entertainment", "general", "health", "science", "sports", "technology"
    ];

    const fetchIfAllowed = async (sourceKey: string, endpoint: string) => {
     if (
  sources.length === 0 ||
  sources.includes(sourceKey.toLowerCase()) ||
  sources.includes(SOURCE_KEY_MAP[sourceKey] || sourceKey)
) {
        const paramsObj: Record<string, string> = {
          query: queryStr,
          page: pageNum.toString(),
        };
        if (endpoint === "newsapi") {
          if (fromDate) paramsObj.fromDate = fromDate;
          if (toDate) paramsObj.toDate = toDate;
        } else if (endpoint === "guardianapi") {
          if (fromDate) paramsObj.fromDate = fromDate;
          if (toDate) paramsObj.toDate = toDate;
        } else if (endpoint === "gnewsapi") {
          if (category && GNEWS_TOPICS.includes(category.toLowerCase())) {
            paramsObj.topic = category.toLowerCase();
          }
          if (fromDate) paramsObj.fromDate = fromDate;
          if (toDate) paramsObj.toDate = toDate;
        } else if (endpoint === "mediastackapi") {
          if (category && MEDIASTACK_CATEGORIES.includes(category.toLowerCase())) {
            paramsObj.categories = category.toLowerCase();
          }
          if (toDate) paramsObj.date = toDate;
          else if (fromDate) paramsObj.date = fromDate;
        } else if (endpoint === "currentsapi") {
          if (category) paramsObj.category = category;
          if (fromDate) paramsObj.fromDate = fromDate;
          if (toDate) paramsObj.toDate = toDate;
        }

        const params = new URLSearchParams(paramsObj);
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

  const fetchAllNewsCallback = useCallback(fetchAllNews, [preferredSources, preferredCategories]);

  useEffect(() => {
    latestFiltersRef.current = filters || null;
  }, [filters]);

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

  useEffect(() => {
    latestQueryRef.current = query;
    setArticles([]);
    setPage(1);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [query, refreshKey, filters]);

  useEffect(() => {
    fetchAllNewsCallback(latestQueryRef.current, page, page > 1, latestFiltersRef.current);
  }, [page, fetchAllNewsCallback]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [query, refreshKey, filters]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <main ref={scrollRef} className="w-full flex flex-col items-center px-4 py-6">
      {showFilters && (
        <div className="mb-8 flex justify-center">
          <FilterCard
            onClose={onCloseFilters}
            onSave={onSaveFilters}
            onClear={onClearFilters}
            initialFilters={filters || undefined}
          />
        </div>
      )}

      <section ref={containerRef} className="w-full flex justify-center">
        <div className="max-w-5xl w-full mx-auto">
          {loading && articles.length === 0 && <Loader />}

          {filters && (
            <div className="mb-4 flex flex-wrap items-center gap-2 bg-white rounded-lg shadow-sm px-4 py-2">
              {filters.source && filters.source !== "All Sources" && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                  Source: {filters.source}
                </span>
              )}
              {filters.category && filters.category !== "All Categories" && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  Category: {filters.category}
                </span>
              )}
              {filters.fromDate && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  From: {filters.fromDate}
                </span>
              )}
              {filters.toDate && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  To: {filters.toDate}
                </span>
              )}
              <button
                onClick={onClearFilters}
                className="ml-auto text-xs text-red-600 underline hover:text-red-800"
              >
                Clear Filters
              </button>
            </div>
          )}

          {articles.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
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
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try changing your search terms or filters.
                </p>
              </div>
            )
          )}

          {loading && articles.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Loader message="Loading more articles..." />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
