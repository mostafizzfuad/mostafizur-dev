import type { Route } from "./+types/index";
import type {
	Project,
	PostMeta,
	StrapiResponse,
	StrapiProject,
	StrapiPost,
} from "~/types";
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
	// ১. প্যারালাল ফেচিং (প্রজেক্ট এবং পোস্ট দুটোই API থেকে)
	const [projectsRes, postsRes] = await Promise.all([
		fetch(
			`${import.meta.env.VITE_API_URL}/projects?filters[featured][$eq]=true&populate=*`,
		),
		fetch(
			`${
				import.meta.env.VITE_API_URL
			}/posts?sort[0]=date:desc&pagination[limit]=3&populate=image`,
		),
	]);

	if (!projectsRes.ok || !postsRes.ok) {
		throw new Error("Failed to fetch data");
	}

	// ২. রেসপন্স পার্স করা
	const projectsJson: StrapiResponse<StrapiProject> =
		await projectsRes.json();
	const postsJson: StrapiResponse<StrapiPost> = await postsRes.json();

	// ৩. Strapi ডেটা ম্যাপ করা
	const projects = projectsJson.data.map((item: any) => ({
		id: item.id,
		documentId: item.documentId,
		title: item.title,
		description: item.description,
		image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
		url: item.url,
		date: item.date,
		category: item.category,
		featured: item.featured,
	}));

	const posts = postsJson.data.map((item: any) => ({
		id: item.id,
		slug: item.slug,
		title: item.title,
		excerpt: item.excerpt,
		date: item.date,
		image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
	}));

	return { projects, posts };
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
