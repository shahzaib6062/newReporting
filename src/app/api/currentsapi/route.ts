import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.CURRENTS_API_KEY!;
const BASE_URL = process.env.CURRENTS_API_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const from = searchParams.get("fromDate") || "";
  const to = searchParams.get("toDate") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const limit = 20;
  const offset = (page - 1) * limit;
  const url = new URL(BASE_URL);

  url.searchParams.append("apiKey", API_KEY);
  url.searchParams.append("language", "en");
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());
  if (query) url.searchParams.append("keywords", query);
  if (category) url.searchParams.append("category", category.toLowerCase());
  if (from) url.searchParams.append("start_date", from);
  if (to) url.searchParams.append("end_date", to);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    const articles = (data.news || []).map((item: Record<string, unknown>) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.image,
      publishedAt: item.published,
      author: item.author || "Unknown Author",
      source: { name: "Currents API" },
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
