export default function HeroSection() {
	return (
		<div className="text-center mb-12">
			<h2
				className="text-4xl font-bold text-foreground mb-4"
				data-testid="text-hero-title"
			>
				Protect Your Student Visa Status
			</h2>
			<p
				className="text-xl text-muted-foreground max-w-3xl mx-auto"
				data-testid="text-hero-description"
			>
				Analyze your social media content to identify posts that could
				potentially impact your student visa. Get personalized recommendations
				to maintain compliance with immigration guidelines.
			</p>
		</div>
	);
}
