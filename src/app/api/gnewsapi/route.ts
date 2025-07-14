import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GNEWS_API_KEY!;
const BASE_URL = process.env.GNEWS_API_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const topic = searchParams.get("category") || "";
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
  if (topic) url.searchParams.append("topic", topic.toLowerCase());

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    const articles = (data.articles || []).map((item: any) => ({
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
