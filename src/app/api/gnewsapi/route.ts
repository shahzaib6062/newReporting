import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GNEWS_API_KEY!;
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
  const topic = searchParams.get("topic") || ""; 
  const from = searchParams.get("fromDate") || "";
  const to = searchParams.get("toDate") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.append("token", API_KEY);
  url.searchParams.append("lang", "en");
  url.searchParams.append("max", "20");
  url.searchParams.append("page", page.toString());
  url.searchParams.append("sort_by", "publishedAt");

  if (query) url.searchParams.append("q", query);
  if (from) url.searchParams.append("from", from);
  if (to) url.searchParams.append("to", to);
  if (topic) url.searchParams.append("topic", topic); // GNews only accepts predefined topics

  try {
    const response = await fetch(url.toString());
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      const articles = (data.articles || []).map((item: GNewsItem) => ({
        title: item.title,
        description: item.description,
        url: item.url,
        urlToImage: item.image,
        publishedAt: item.publishedAt,
        author: item.author || "Unknown Author",
        source: { name: item.source?.name || "GNews API" },
      }));
      return NextResponse.json(articles);
    } else {
      const text = await response.text();
      console.error("GNews API returned non-JSON:", text);
      return NextResponse.json({ error: "Non-JSON GNews response", raw: text }, { status: 500 });
    }
  } catch (error) {
    console.error("GNews API error:", error);
    return NextResponse.json({ error: "GNews fetch failed" }, { status: 500 });
  }
}
