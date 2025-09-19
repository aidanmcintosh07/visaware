import { NextRequest, NextResponse } from "next/server";

interface FacebookPostData {
	id: string;
	text: string;
	timestamp: string;
	likes: number;
	comments: number;
	shares: number;
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

		// Create realistic number of posts based on username (to simulate real accounts)
		const basePostCount = Math.max(1, Math.min(6, (username.length + 1) % 7));

		// All available mock Facebook posts
		const allMockPosts: FacebookPostData[] = [
			{
				id: "fb_post_1",
				text: "Just opened my online store selling handmade crafts! 🛍️ DM me for custom orders! #business #handmade #entrepreneur",
				timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
				likes: 67,
				comments: 23,
				shares: 8,
			},
			{
				id: "fb_post_2",
				text: "Can't believe how expensive tuition is here 😤 Thinking about transferring to a cheaper school or just going back home #college #money",
				timestamp: new Date(Date.now() - 129600000).toISOString(), // 1.5 days ago
				likes: 42,
				comments: 19,
				shares: 3,
			},
			{
				id: "fb_post_3",
				text: "Party at my apartment tonight! 🎉🍺 Come through if you want to have some real fun! No boring study sessions here 😎",
				timestamp: new Date(Date.now() - 216000000).toISOString(), // 2.5 days ago
				likes: 89,
				comments: 34,
				shares: 12,
			},
			{
				id: "fb_post_4",
				text: "Looking for someone to write my research paper. Willing to pay good money 💰 Hit me up if interested #help #college",
				timestamp: new Date(Date.now() - 302400000).toISOString(), // 3.5 days ago
				likes: 15,
				comments: 28,
				shares: 2,
			},
			{
				id: "fb_post_5",
				text: "Missing my family so much 😭 Only 2 more years until I can move back permanently and leave all this behind #homesick #family",
				timestamp: new Date(Date.now() - 388800000).toISOString(), // 4.5 days ago
				likes: 156,
				comments: 67,
				shares: 23,
			},
			{
				id: "fb_post_6",
				text: "Group study session at the coffee shop ☕ Finals week is here! Who else is stressed? #finals #studygroup #coffee",
				timestamp: new Date(Date.now() - 475200000).toISOString(), // 5.5 days ago
				likes: 89,
				comments: 45,
				shares: 12,
			},
		];

		// Return a realistic subset based on the calculated post count
		const mockPosts = allMockPosts.slice(0, basePostCount);

		return NextResponse.json({
			success: true,
			platform: "facebook",
			username,
			posts: mockPosts,
			scrapedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Facebook scraping error:", error);
		return NextResponse.json(
			{
				error: "Failed to scrape Facebook profile",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
