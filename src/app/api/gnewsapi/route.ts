import { NextRequest, NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY!;
const BASE_URL = process.env.GNEWS_API_URL!;

interface GNewsItem {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  author?: string;
  source: {
    name: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const url = new URL(`${BASE_URL}/search`);
  const apiKey = GNEWS_API_KEY;

  url.searchParams.append("token", apiKey);
  url.searchParams.append("lang", "en");
  url.searchParams.append("max", "20");
  url.searchParams.append("page", page.toString());
  url.searchParams.append("sort_by", "publishedAt");

  if (query) url.searchParams.append("q", query);
  if (fromDate) url.searchParams.append("from", fromDate);
  if (toDate) url.searchParams.append("to", toDate);
  if (category) url.searchParams.append("topic", category); // only works for predefined topics

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    const articles = (data.articles || []).map((item: GNewsItem) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.image,
      publishedAt: item.publishedAt,
      author: item.author || "Unknown Author",
      source: { name: item.source?.name || "GNews" },
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
