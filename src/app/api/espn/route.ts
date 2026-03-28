import { NextResponse } from "next/server";

export async function GET() {
  try {
    const urls = [
      { url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news", sport: "NBA" },
      { url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news", sport: "NFL" },
      { url: "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news", sport: "College Basketball" },
    ];

    const results = await Promise.all(
      urls.map(async ({ url, sport }) => {
        const res = await fetch(url);
        const data = await res.json();
        return data.articles?.slice(0, 1).map((a: { headline: string }) => ({
          headline: a.headline,
          sport,
        })) || [];
      })
    );

    return NextResponse.json({ trends: results.flat() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ trends: [] }, { status: 500 });
  }
}