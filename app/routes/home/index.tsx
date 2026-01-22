import type { Route } from "./+types/index";
import FeaturedProjects from "~/components/featured-projects";
import type { Project } from "~/types";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Mostafizur's Portfolio" },
		{
			name: "description",
			content: "Frontend, Backend and Full Stack Projects",
		},
	];
}

// ১. লোডার দিয়ে ডেটা ফেচিং
export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`);
	const data = await res.json();

	return { projects: data };
}

// ২. কম্পোনেন্টে ডেটা পাস করা
const HomePage = ({ loaderData }: Route.ComponentProps) => {
	const { projects } = loaderData;

	return (
		<>
			{/* ৩. FeaturedProjects এ ডেটা পাঠানো হচ্ছে */}
			<FeaturedProjects projects={projects} count={2} />
		</>
	);
};

export default HomePage;
