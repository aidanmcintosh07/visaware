import { NextRequest, NextResponse } from "next/server";

interface PostData {
	url: string;
	caption: string;
	imageUrl: string;
	timestamp: string;
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

		// Create realistic number of posts based on username length (to simulate real accounts)
		const basePostCount = Math.max(1, Math.min(8, username.length % 9));

		// All available mock posts
		const allMockPosts: PostData[] = [
			{
				url: `https://instagram.com/p/mock1`,
				caption:
					"Just finished my midterm exams! 📚 Time to celebrate with some friends 🎉 #studentlife #college",
				imageUrl: "https://via.placeholder.com/400x400?text=Study+Session",
				timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
			},
			{
				url: `https://instagram.com/p/mock2`,
				caption:
					"Working on my part-time job at the campus bookstore 📖 Love helping other students! #campusjob #workingstudy",
				imageUrl: "https://via.placeholder.com/400x400?text=Campus+Job",
				timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
			},
			{
				url: `https://instagram.com/p/mock3`,
				caption:
					"Missing home so much 😢 Can't wait to graduate and move back permanently! #homesick #graduation",
				imageUrl: "https://via.placeholder.com/400x400?text=Missing+Home",
				timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
			},
			{
				url: `https://instagram.com/p/mock4`,
				caption:
					"Study group session at the library! Working hard on our computer science project 💻 #studyhard #CS",
				imageUrl: "https://via.placeholder.com/400x400?text=Study+Group",
				timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
			},
			{
				url: `https://instagram.com/p/mock5`,
				caption:
					"Started my own freelance web development business! Taking on clients while studying 💼 #entrepreneur #webdev",
				imageUrl: "https://via.placeholder.com/400x400?text=Freelance+Work",
				timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
			},
			{
				url: `https://instagram.com/p/mock6`,
				caption:
					"Pizza party at the dorm! 🍕 College life is the best life #dormlife #friends",
				imageUrl: "https://via.placeholder.com/400x400?text=Pizza+Party",
				timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
			},
			{
				url: `https://instagram.com/p/mock7`,
				caption:
					"Trying to find cheap textbooks online 💸 Being a student is expensive! #studentstruggles #textbooks",
				imageUrl: "https://via.placeholder.com/400x400?text=Textbooks",
				timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
			},
			{
				url: `https://instagram.com/p/mock8`,
				caption:
					"Beautiful sunset from my dorm window 🌅 Sometimes you just need to appreciate the simple things #sunset #dormlife",
				imageUrl: "https://via.placeholder.com/400x400?text=Sunset",
				timestamp: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
			},
		];

		// Return a realistic subset based on the calculated post count
		const mockPosts = allMockPosts.slice(0, basePostCount);

		return NextResponse.json({
			success: true,
			platform: "instagram",
			username,
			posts: mockPosts,
			scrapedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Instagram scraping error:", error);
		return NextResponse.json(
			{
				error: "Failed to scrape Instagram profile",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
