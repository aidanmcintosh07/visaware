"use client";

import Link from "next/link";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link href="/" className="flex items-center">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold text-sm">V</span>
								</div>
								<span className="text-xl font-bold text-gray-900">
									VisaAware
								</span>
							</div>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<SignedOut>
							<Link
								href="/pricing"
								className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
							>
								Pricing
							</Link>
							<Link
								href="/sign-in"
								className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
							>
								Sign In
							</Link>
						</SignedOut>

						<SignedIn>
							<Link
								href="/dashboard"
								className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
							>
								Dashboard
							</Link>
							<Link
								href="/pricing"
								className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
							>
								Pricing
							</Link>
							<div className="ml-4 pl-4 border-l border-gray-200">
								<UserButton
									appearance={{
										elements: {
											avatarBox: "h-8 w-8",
										},
									}}
								/>
							</div>
						</SignedIn>
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center space-x-3">
						<SignedIn>
							<UserButton
								appearance={{
									elements: {
										avatarBox: "h-8 w-8",
									},
								}}
							/>
						</SignedIn>
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleMobileMenu}
							className="h-10 w-10 p-0 hover:bg-gray-100"
							aria-label="Toggle menu"
						>
							{isMobileMenuOpen ? (
								<X className="h-5 cursor-pointer w-5" />
							) : (
								<Menu className="h-5 cursor-pointer w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className="md:hidden border-t border-gray-100 bg-white">
						<div className="px-2 py-3 space-y-1">
							<SignedOut>
								<Link
									href="/pricing"
									className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Pricing
								</Link>
								<Link
									href="/sign-in"
									className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Sign In
								</Link>
							</SignedOut>

							<SignedIn>
								<Link
									href="/dashboard"
									className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Dashboard
								</Link>

								<Link
									href="/pricing"
									className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Pricing
								</Link>
							</SignedIn>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}

export default Header;
