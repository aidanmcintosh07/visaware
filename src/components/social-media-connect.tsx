import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Search, TrendingUp, Plus } from "lucide-react";

export default function SocialMediaConnect() {
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
					{/* Instagram */}
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
									<svg
										className="w-6 h-6 text-white"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium">Instagram</h3>
									<p className="text-sm text-muted-foreground">
										Connect your profile
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm" className="gap-2">
								<Plus className="w-4 h-4" />
								Connect
							</Button>
						</div>
					</Card>

					{/* Twitter/X */}
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
									<svg
										className="w-6 h-6 text-white"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium">Twitter/X</h3>
									<p className="text-sm text-muted-foreground">
										Connect your profile
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm" className="gap-2">
								<Plus className="w-4 h-4" />
								Connect
							</Button>
						</div>
					</Card>

					{/* Facebook */}
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
									<svg
										className="w-6 h-6 text-white"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium">Facebook</h3>
									<p className="text-sm text-muted-foreground">
										Connect your profile
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm" className="gap-2">
								<Plus className="w-4 h-4" />
								Connect
							</Button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
