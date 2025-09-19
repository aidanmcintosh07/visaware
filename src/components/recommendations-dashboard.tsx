import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	AlertTriangle,
	CheckCircle,
	XCircle,
	Eye,
	Shield,
	TrendingUp,
	Clock,
	Users,
} from "lucide-react";

interface RiskAssessment {
	riskLevel: "low" | "medium" | "high" | "critical";
	riskScore: number;
	categories: string[];
	explanation: string;
	recommendations: string[];
}

interface AnalyzedContent {
	platform: string;
	content: string;
	assessment: RiskAssessment;
	timestamp: string;
}

interface RecommendationsDashboardProps {
	analysisResults?: AnalyzedContent[];
	isLoading?: boolean;
	overallRiskScore?: number;
}

export default function RecommendationsDashboard({
	analysisResults = [],
	isLoading = false,
	overallRiskScore = 0,
}: RecommendationsDashboardProps) {
	// Get risk level color
	const getRiskColor = (level: string) => {
		switch (level) {
			case "low":
				return "text-green-600 bg-green-50 border-green-200";
			case "medium":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "high":
				return "text-orange-600 bg-orange-50 border-orange-200";
			case "critical":
				return "text-red-600 bg-red-50 border-red-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	const getRiskIcon = (level: string) => {
		switch (level) {
			case "low":
				return <CheckCircle className="w-4 h-4" />;
			case "medium":
				return <Eye className="w-4 h-4" />;
			case "high":
				return <AlertTriangle className="w-4 h-4" />;
			case "critical":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Shield className="w-4 h-4" />;
		}
	};

	// Calculate statistics
	const stats = {
		totalPosts: analysisResults.length,
		lowRisk: analysisResults.filter((r) => r.assessment.riskLevel === "low")
			.length,
		mediumRisk: analysisResults.filter(
			(r) => r.assessment.riskLevel === "medium"
		).length,
		highRisk: analysisResults.filter((r) => r.assessment.riskLevel === "high")
			.length,
		criticalRisk: analysisResults.filter(
			(r) => r.assessment.riskLevel === "critical"
		).length,
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
						<span className="text-white text-sm font-medium">3</span>
					</div>
					<h2 className="text-2xl font-semibold">Analyzing Your Content...</h2>
				</div>
				<div className="grid gap-4">
					{[1, 2, 3].map((i) => (
						<Card key={i} className="animate-pulse">
							<CardContent className="p-6">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2"></div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center gap-2">
				<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
					<span className="text-white text-sm font-medium">3</span>
				</div>
				<h2 className="text-2xl font-semibold">Get Recommendations</h2>
			</div>

			{/* Overall Risk Score */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="w-5 h-5" />
						Overall Visa Risk Assessment
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-4">
						<div className="flex-1">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm font-medium">Risk Score</span>
								<span className="text-2xl font-bold">
									{overallRiskScore}/100
								</span>
							</div>
							<Progress value={overallRiskScore} className="h-2" />
						</div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{stats.lowRisk}
							</div>
							<div className="text-sm text-muted-foreground">Low Risk</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-600">
								{stats.mediumRisk}
							</div>
							<div className="text-sm text-muted-foreground">Medium Risk</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">
								{stats.highRisk}
							</div>
							<div className="text-sm text-muted-foreground">High Risk</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-red-600">
								{stats.criticalRisk}
							</div>
							<div className="text-sm text-muted-foreground">Critical Risk</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Analysis Results */}
			{analysisResults.length > 0 ? (
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">Content Analysis Results</h3>
					<div className="space-y-4">
						{analysisResults.map((result, index) => (
							<Card
								key={index}
								className={`border-l-4 ${getRiskColor(
									result.assessment.riskLevel
								)}`}
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											{getRiskIcon(result.assessment.riskLevel)}
											<Badge
												variant={
													result.assessment.riskLevel === "critical"
														? "destructive"
														: "secondary"
												}
											>
												{result.assessment.riskLevel.toUpperCase()} RISK
											</Badge>
											<Badge variant="outline">{result.platform}</Badge>
										</div>
										<div className="text-right text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Clock className="w-3 h-3" />
												{new Date(result.timestamp).toLocaleDateString()}
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h4 className="font-medium mb-2">Content</h4>
										<p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
											{result.content.length > 200
												? `${result.content.substring(0, 200)}...`
												: result.content}
										</p>
									</div>

									<div>
										<h4 className="font-medium mb-2">Risk Analysis</h4>
										<p className="text-sm text-muted-foreground">
											{result.assessment.explanation}
										</p>
									</div>

									{result.assessment.categories.length > 0 && (
										<div>
											<h4 className="font-medium mb-2">Risk Categories</h4>
											<div className="flex flex-wrap gap-2">
												{result.assessment.categories.map((category, idx) => (
													<Badge
														key={idx}
														variant="outline"
														className="text-xs"
													>
														{category.replace("_", " ").toUpperCase()}
													</Badge>
												))}
											</div>
										</div>
									)}

									{result.assessment.recommendations.length > 0 && (
										<div>
											<h4 className="font-medium mb-2">Recommendations</h4>
											<ul className="space-y-1">
												{result.assessment.recommendations.map((rec, idx) => (
													<li
														key={idx}
														className="text-sm text-muted-foreground flex items-start gap-2"
													>
														<span className="text-blue-600 mt-1">•</span>
														{rec}
													</li>
												))}
											</ul>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			) : (
				<Card>
					<CardContent className="p-8 text-center">
						<Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">
							No Analysis Results Yet
						</h3>
						<p className="text-muted-foreground mb-4">
							Connect your social media accounts and run an analysis to see your
							visa risk assessment.
						</p>
						<Button>Start Analysis</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
