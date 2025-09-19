import Header from "@/components/header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function IndexLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<MaxWidthWrapper>
				<Header />
				{children}
			</MaxWidthWrapper>
		</>
	);
}
