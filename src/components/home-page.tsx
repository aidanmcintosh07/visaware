"use client";

import { useState } from "react";
import HeroSection from "@/components/hero-section";
import InteractiveSocialConnect from "@/components/interactive-social-connect";
import RecommendationsDashboard from "@/components/recommendations-dashboard";

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

export default function HomePage() {
	const [analysisResults, setAnalysisResults] = useState<AnalyzedContent[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handleAnalysisComplete = (results: AnalyzedContent[]) => {
		setAnalysisResults(results);
	};

	const handleAnalysisStart = () => {
		setIsAnalyzing(true);
	};

	const handleAnalysisEnd = () => {
		setIsAnalyzing(false);
	};

	const overallRiskScore =
		analysisResults.length > 0
			? Math.round(
					analysisResults.reduce(
						(sum, result) => sum + result.assessment.riskScore,
						0
					) / analysisResults.length
			  )
			: 0;

	return (
		<div className="min-h-screen bg-background text-foreground">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
				<HeroSection />
				<InteractiveSocialConnect
					onAnalysisComplete={handleAnalysisComplete}
					onAnalysisStart={handleAnalysisStart}
					onAnalysisEnd={handleAnalysisEnd}
				/>
				<RecommendationsDashboard
					analysisResults={analysisResults}
					isLoading={isAnalyzing}
					overallRiskScore={overallRiskScore}
				/>
			</main>
		</div>
	);
}
