"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Link,
	Search,
	TrendingUp,
	Plus,
	Loader2,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface ConnectionState {
	platform: string;
	username: string;
	isConnected: boolean;
	isConnecting: boolean;
	error?: string;
}

interface AnalyzedContent {
	platform: string;
	content: string;
	assessment: {
		riskLevel: "low" | "medium" | "high" | "critical";
		riskScore: number;
		categories: string[];
		explanation: string;
		recommendations: string[];
	};
	timestamp: string;
}

interface InteractiveSocialConnectProps {
	onAnalysisComplete?: (results: AnalyzedContent[]) => void;
	onAnalysisStart?: () => void;
	onAnalysisEnd?: () => void;
}

export default function InteractiveSocialConnect({
	onAnalysisComplete,
	onAnalysisStart,
	onAnalysisEnd,
}: InteractiveSocialConnectProps) {
	const { user } = useUser();
	const [connections, setConnections] = useState<ConnectionState[]>([
		{
			platform: "instagram",
			username: "",
			isConnected: false,
			isConnecting: false,
		},
		{
			platform: "twitter",
			username: "",
			isConnected: false,
			isConnecting: false,
		},
		{
			platform: "facebook",
			username: "",
			isConnected: false,
			isConnecting: false,
		},
	]);

	const [analysisResults, setAnalysisResults] = useState<unknown[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handleConnect = async (platform: string) => {
		if (!user) {
			toast.error("Please sign in to connect your accounts");
			return;
		}

		const connection = connections.find((c) => c.platform === platform);
		if (!connection?.username) {
			toast.error("Please enter a username");
			return;
		}

		// Update connecting state
		setConnections((prev) =>
			prev.map((c) =>
				c.platform === platform
					? { ...c, isConnecting: true, error: undefined }
					: c
			)
		);

		try {
			// Call the scraping API
			const response = await fetch(`/api/scrape/${platform}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: connection.username,
				}),
			});

			const result = await response.json();

			if (result.success) {
				// Mark as connected
				setConnections((prev) =>
					prev.map((c) =>
						c.platform === platform
							? { ...c, isConnected: true, isConnecting: false }
							: c
					)
				);

				// Store the scraped data for analysis
				localStorage.setItem(`scraped_${platform}`, JSON.stringify(result));

				const postCount = result.posts?.length || result.tweets?.length || 0;
				toast.success(
					`Successfully connected to ${platform}! Found ${postCount} ${
						postCount === 1 ? "post" : "posts"
					}.`
				);
			} else {
				throw new Error(result.error || "Connection failed");
			}
		} catch (error) {
			setConnections((prev) =>
				prev.map((c) =>
					c.platform === platform
						? {
								...c,
								isConnecting: false,
								error:
									error instanceof Error ? error.message : "Connection failed",
						  }
						: c
				)
			);
		}
	};

	const handleUsernameChange = (platform: string, username: string) => {
		setConnections((prev) =>
			prev.map((c) => (c.platform === platform ? { ...c, username } : c))
		);
	};

	const runAnalysis = async () => {
		const connectedPlatforms = connections.filter((c) => c.isConnected);
		if (connectedPlatforms.length === 0) {
			toast.error("Please connect at least one social media account first");
			return;
		}

		setIsAnalyzing(true);
		onAnalysisStart?.();
		const allContent: Array<{
			content: string;
			platform: string;
			contentType: string;
		}> = [];

		try {
			// Collect all scraped content
			for (const connection of connectedPlatforms) {
				const scrapedData = localStorage.getItem(
					`scraped_${connection.platform}`
				);
				if (scrapedData) {
					const data = JSON.parse(scrapedData);
					const content = data.posts || data.tweets || [];

					content.forEach((item: { caption?: string; text?: string }) => {
						allContent.push({
							content: item.caption || item.text || "",
							platform: connection.platform,
							contentType: connection.platform === "twitter" ? "tweet" : "post",
						});
					});
				}
			}

			// Analyze content in batches
			const batchSize = 5;
			const results = [];

			for (let i = 0; i < allContent.length; i += batchSize) {
				const batch = allContent.slice(i, i + batchSize);

				for (const item of batch) {
					try {
						const response = await fetch("/api/analyze", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(item),
						});

						const analysisResult = await response.json();
						if (analysisResult.success) {
							results.push({
								...item,
								assessment: analysisResult.analysis,
								timestamp: new Date().toISOString(),
							});
						}
					} catch (error) {
						console.error("Analysis error for item:", error);
					}
				}
			}

			setAnalysisResults(results);
			onAnalysisComplete?.(results);
			toast.success(`Analysis complete! Analyzed ${results.length} posts.`);
		} catch (error) {
			console.error("Analysis failed:", error);
			toast.error("Analysis failed. Please try again.");
		} finally {
			setIsAnalyzing(false);
			onAnalysisEnd?.();
		}
	};

	const getPlatformIcon = (platform: string) => {
		switch (platform) {
			case "instagram":
				return (
					<div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
						<svg
							className="w-6 h-6 text-white"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
						</svg>
					</div>
				);
			case "twitter":
				return (
					<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
						<svg
							className="w-6 h-6 text-white"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
						</svg>
					</div>
				);
			case "facebook":
				return (
					<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
						<svg
							className="w-6 h-6 text-white"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					</div>
				);
			default:
				return <div className="w-12 h-12 bg-gray-500 rounded-xl"></div>;
		}
	};

	const getConnectionStatus = (connection: ConnectionState) => {
		if (connection.isConnecting) {
			return (
				<Button disabled size="sm" className="gap-2">
					<Loader2 className="w-4 h-4 animate-spin" />
					Connecting...
				</Button>
			);
		}

		if (connection.isConnected) {
			return (
				<Button
					disabled
					size="sm"
					className="gap-2 bg-green-600 hover:bg-green-700"
				>
					<CheckCircle className="w-4 h-4" />
					Connected
				</Button>
			);
		}

		return (
			<Button
				variant="outline"
				size="sm"
				className="gap-2"
				onClick={() => handleConnect(connection.platform)}
			>
				<Plus className="w-4 h-4" />
				Connect
			</Button>
		);
	};

	return (
		<div className="space-y-12">
			{/* Three Step Process */}
			<div className="grid md:grid-cols-3 gap-8">
				<div className="text-center space-y-4">
					<div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
						<Link className="w-8 h-8 text-blue-600" />
					</div>
					<div>
						<h3 className="text-xl font-semibold mb-2">1. Connect Accounts</h3>
						<p className="text-muted-foreground">
							Securely connect your social media accounts for analysis
						</p>
					</div>
				</div>

				<div className="text-center space-y-4">
					<div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
						<Search className="w-8 h-8 text-blue-600" />
					</div>
					<div>
						<h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
						<p className="text-muted-foreground">
							AI scans your content for potential visa compliance issues
						</p>
					</div>
				</div>

				<div className="text-center space-y-4">
					<div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
						<TrendingUp className="w-8 h-8 text-blue-600" />
					</div>
					<div>
						<h3 className="text-xl font-semibold mb-2">
							3. Get Recommendations
						</h3>
						<p className="text-muted-foreground">
							Receive detailed guidance on protecting your visa status
						</p>
					</div>
				</div>
			</div>

			{/* Connect Your Accounts Section */}
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
						<span className="text-white text-sm font-medium">1</span>
					</div>
					<h2 className="text-2xl font-semibold">Connect Your Accounts</h2>
				</div>

				<div className="space-y-4 max-w-2xl">
					{connections.map((connection) => (
						<Card key={connection.platform} className="p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										{getPlatformIcon(connection.platform)}
										<div>
											<h3 className="font-medium capitalize">
												{connection.platform}
											</h3>
											<p className="text-sm text-muted-foreground">
												Connect your profile
											</p>
										</div>
									</div>
									{getConnectionStatus(connection)}
								</div>

								{!connection.isConnected && (
									<div className="space-y-2">
										<Label htmlFor={`${connection.platform}-username`}>
											Username
										</Label>
										<Input
											id={`${connection.platform}-username`}
											placeholder={`Enter your ${connection.platform} username`}
											value={connection.username}
											onChange={(e) =>
												handleUsernameChange(
													connection.platform,
													e.target.value
												)
											}
										/>
									</div>
								)}

								{connection.error && (
									<div className="flex items-center gap-2 text-red-600 text-sm">
										<AlertCircle className="w-4 h-4" />
										{connection.error}
									</div>
								)}
							</div>
						</Card>
					))}
				</div>

				{/* Analysis Button */}
				{connections.some((c) => c.isConnected) && (
					<div className="pt-6">
						<Button
							onClick={runAnalysis}
							disabled={isAnalyzing}
							size="lg"
							className="gap-2"
						>
							{isAnalyzing ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Analyzing Content...
								</>
							) : (
								<>
									<Search className="w-4 h-4" />
									Analyze My Content
								</>
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
