import type { Route } from "./+types/index";
import type { Project, PostMeta, StrapiResponse, StrapiProject } from "~/types";
import FeaturedProjects from "~/components/featured-projects";
import AboutPreview from "~/components/about-preview";
import LatestPosts from "~/components/latest-posts";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Mostafizur's Portfolio" },
		{
			name: "description",
			content: "Frontend and Full Stack Projects",
		},
	];
}

// লোডার দিয়ে ডেটা ফেচিং
export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: PostMeta[] }> {
	// ১. প্যারালাল ফেচিং (প্রজেক্ট Strapi থেকে, পোস্ট এখনো JSON থেকে)
	const [projectsRes, postsRes] = await Promise.all([
		fetch(
			`${import.meta.env.VITE_API_URL}/projects?filters[featured][$eq]=true&populate=*`,
		),
		fetch(new URL("/posts-meta.json", request.url)), // পোস্টগুলো পরে Strapi তে নেব
	]);

	if (!projectsRes.ok || !postsRes.ok) {
		throw new Error("Failed to fetch data");
	}

	// ২. রেসপন্স পার্স করা
	const projectsJson: StrapiResponse<StrapiProject> =
		await projectsRes.json();
	const postsJson = await postsRes.json();

	// ৩. Strapi ডেটা ম্যাপ করা
	const projects = projectsJson.data.map((item: any) => ({
		id: item.id,
		documentId: item.documentId,
		title: item.title,
		description: item.description,
		image: item.image?.url
			? `${import.meta.env.VITE_STRAPI_URL}${item.image.url}`
			: "/images/no-image.png",
		url: item.url,
		date: item.date,
		category: item.category,
		featured: item.featured,
	}));

	// পোস্টগুলো এখনো raw JSON হিসেবেই আছে
	return { projects, posts: postsJson };
}

// কম্পোনেন্টে ডেটা পাস করা
const HomePage = ({ loaderData }: Route.ComponentProps) => {
	const { projects, posts } = loaderData;

	return (
		<>
			<FeaturedProjects projects={projects} />
			<AboutPreview />
			<LatestPosts posts={posts} limit={3} />
		</>
	);
};

export default HomePage;
