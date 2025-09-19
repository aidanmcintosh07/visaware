import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
	content: string;
	platform: "instagram" | "twitter" | "facebook";
	contentType: "post" | "tweet" | "story";
}

interface RiskAssessment {
	riskLevel: "low" | "medium" | "high" | "critical";
	riskScore: number; // 0-100
	categories: string[];
	explanation: string;
	recommendations: string[];
}

export async function POST(request: NextRequest) {
	try {
		const { content, platform, contentType }: AnalysisRequest =
			await request.json();

		if (!content || !platform) {
			return NextResponse.json(
				{
					error: "Content and platform are required",
				},
				{ status: 400 }
			);
		}

		// Create the prompt for AI analysis
		const prompt = `
You are an expert immigration advisor specializing in US student visa compliance. Analyze the following ${
			contentType || "social media content"
		} from ${platform} for potential risks to a student's F-1 visa status.

Content to analyze:
"${content}"

Please assess this content for the following potential visa compliance risks:

1. **Unauthorized Employment**: Content suggesting paid work, freelancing, or business activities
2. **Academic Performance**: Posts indicating poor academic performance, skipping classes, or not maintaining full-time enrollment
3. **Intent to Immigrate**: Content suggesting permanent immigration intentions rather than temporary student status
4. **Illegal Activities**: Any reference to illegal substances, activities, or behavior
5. **Financial Violations**: Content about financial struggles that might indicate inability to maintain student status
6. **Location Issues**: Posts suggesting prolonged absence from the US or studying remotely from outside the US
7. **Program Violations**: Content indicating program changes, transfers, or academic issues

Provide your assessment in the following JSON format:
{
  "riskLevel": "low|medium|high|critical",
  "riskScore": 0-100,
  "categories": ["list of applicable risk categories"],
  "explanation": "detailed explanation of identified risks",
  "recommendations": ["specific actionable recommendations"]
}

Be thorough but fair in your assessment. Consider cultural context and avoid false positives while identifying genuine compliance risks.
    `;

		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are an expert immigration advisor. Provide accurate, helpful analysis of social media content for US F-1 student visa compliance. Always respond with valid JSON.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.3,
			max_tokens: 1000,
		});

		const analysisResult = completion.choices[0]?.message?.content;

		if (!analysisResult) {
			throw new Error("No analysis result received from AI");
		}

		// Parse the JSON response
		let assessment: RiskAssessment;
		try {
			assessment = JSON.parse(analysisResult);
		} catch (parseError) {
			console.error("Failed to parse AI response:", analysisResult, parseError);
			// Fallback assessment
			assessment = {
				riskLevel: "medium",
				riskScore: 50,
				categories: ["analysis_error"],
				explanation:
					"Unable to fully analyze content due to parsing error. Manual review recommended.",
				recommendations: [
					"Consider reviewing this content manually with an immigration advisor.",
				],
			};
		}

		return NextResponse.json({
			success: true,
			analysis: assessment,
			originalContent: content,
			platform,
			contentType,
			analyzedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Content analysis error:", error);
		return NextResponse.json(
			{
				error: "Failed to analyze content",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// Batch analysis endpoint for multiple pieces of content
export async function PUT(request: NextRequest) {
	try {
		const { contents }: { contents: AnalysisRequest[] } = await request.json();

		if (!contents || !Array.isArray(contents) || contents.length === 0) {
			return NextResponse.json(
				{
					error: "Contents array is required",
				},
				{ status: 400 }
			);
		}

		// Analyze all content pieces
		const analyses = await Promise.all(
			contents.map(async (item) => {
				try {
					// Reuse the single analysis logic
					const response = await fetch(
						`${request.nextUrl.origin}/api/analyze`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(item),
						}
					);

					if (!response.ok) {
						throw new Error(
							`Analysis failed for content: ${item.content.substring(0, 50)}...`
						);
					}

					return await response.json();
				} catch (error) {
					return {
						success: false,
						error: error instanceof Error ? error.message : "Analysis failed",
						originalContent: item.content,
					};
				}
			})
		);

		// Calculate overall risk assessment
		const successfulAnalyses = analyses.filter((a) => a.success);
		const totalRiskScore = successfulAnalyses.reduce(
			(sum, a) => sum + a.analysis.riskScore,
			0
		);
		const averageRiskScore =
			successfulAnalyses.length > 0
				? totalRiskScore / successfulAnalyses.length
				: 0;

		return NextResponse.json({
			success: true,
			batchAnalysis: {
				totalItems: contents.length,
				analyzedSuccessfully: successfulAnalyses.length,
				averageRiskScore,
				overallRiskLevel:
					averageRiskScore > 75
						? "high"
						: averageRiskScore > 50
						? "medium"
						: "low",
				analyses,
			},
			analyzedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Batch analysis error:", error);
		return NextResponse.json(
			{
				error: "Failed to perform batch analysis",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
