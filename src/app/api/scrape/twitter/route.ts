import { NextRequest, NextResponse } from "next/server";

interface TweetData {
	id: string;
	text: string;
	timestamp: string;
	likes: number;
	retweets: number;
	replies: number;
}

export async function POST(request: NextRequest) {
	try {
		const { username } = await request.json();

		if (!username) {
			return NextResponse.json(
				{ error: "Username is required" },
				{ status: 400 }
			);
		}

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Create realistic number of tweets based on username (to simulate real accounts)
		const baseTweetCount = Math.max(1, Math.min(7, (username.length + 3) % 8));

		// All available mock tweets
		const allMockTweets: TweetData[] = [
			{
				id: "tweet_1",
				text: "Just got my first paycheck from my tutoring job! 💰 Making some extra money while studying #sidehustle #college",
				timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
				likes: 23,
				retweets: 5,
				replies: 8,
			},
			{
				id: "tweet_2",
				text: "Thinking about dropping out and starting my own tech company 🚀 Why waste time in classes when I can build the next unicorn? #entrepreneur #dropout",
				timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
				likes: 45,
				retweets: 12,
				replies: 18,
			},
			{
				id: "tweet_3",
				text: "Anyone know good lawyers for immigration stuff? Asking for a friend who wants to stay permanently 👀 #immigration #help",
				timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
				likes: 8,
				retweets: 2,
				replies: 15,
			},
			{
				id: "tweet_4",
				text: "Skipped all my classes this week to work on a freelance project 💻 Priorities, right? #freelance #workfromhome",
				timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
				likes: 34,
				retweets: 7,
				replies: 22,
			},
			{
				id: "tweet_5",
				text: "Study abroad program is overrated. Much better opportunities back home anyway 🏠 #studyabroad #homesick",
				timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
				likes: 19,
				retweets: 3,
				replies: 11,
			},
			{
				id: "tweet_6",
				text: "Late night coding session 💻 Working on my final project for data structures class #coding #computerscience",
				timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
				likes: 31,
				retweets: 6,
				replies: 9,
			},
			{
				id: "tweet_7",
				text: "Campus Wi-Fi is so slow 😩 How am I supposed to submit assignments like this? #studentproblems #wifi",
				timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
				likes: 67,
				retweets: 14,
				replies: 25,
			},
		];

		// Return a realistic subset based on the calculated tweet count
		const mockTweets = allMockTweets.slice(0, baseTweetCount);

		return NextResponse.json({
			success: true,
			platform: "twitter",
			username,
			tweets: mockTweets,
			scrapedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Twitter scraping error:", error);
		return NextResponse.json(
			{
				error: "Failed to scrape Twitter profile",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
