import { NextRequest, NextResponse } from "next/server";

const CURRENTS_API_KEY = process.env.CURRENTS_API_KEY!;
const BASE_URL = process.env.CURRENTS_API_URL!;

interface CurrentsNewsItem {
  title: string;
  description: string;
  url: string;
  image: string;
  published: string;
  author?: string;
  category?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const limit = 20;
  const offset = (page - 1) * limit;

  const url = new URL(`${BASE_URL}`);
  url.searchParams.append("apiKey", CURRENTS_API_KEY);
  url.searchParams.append("language", "en");
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());

  if (query) url.searchParams.append("keywords", query);
  if (category) url.searchParams.append("category", category);
  if (fromDate) url.searchParams.append("start_date", fromDate);
  if (toDate) url.searchParams.append("end_date", toDate);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    const articles = (data.news || []).map((item: CurrentsNewsItem) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.image,
      publishedAt: item.published,
      author: item.author || "Unknown Author",
      source: { name: "Currents API" },
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Currents API Error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
