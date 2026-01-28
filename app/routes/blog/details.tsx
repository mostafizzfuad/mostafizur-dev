import ReactMarkdown from "react-markdown";
import type { Route } from "./+types/details";
import type { StrapiResponse, StrapiPost } from "~/types";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
	const { slug } = params;

	// ১. স্লাগ দিয়ে ফিল্টার করে পোস্ট ফেচ করা
	const res = await fetch(
		`${
			import.meta.env.VITE_API_URL
		}/posts?filters[slug][$eq]=${slug}&populate=image`,
	);

	if (!res.ok) {
		throw new Error("Failed to fetch posts");
	}

	const json: StrapiResponse<StrapiPost> = await res.json();

	// ২. পোস্ট না পাওয়া গেলে 404 এরর দেওয়া
	if (!json.data.length) {
		throw new Response("Not Found", { status: 404 });
	}

	const item = json.data[0];

	// ৩. ডেটা ম্যাপ করা
	const post = {
		id: item.id,
		slug: item.slug,
		title: item.title,
		excerpt: item.excerpt,
		date: item.date,
		body: item.body,
		image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
	};

	return { post };
}

const BlogPostDetailsPage = ({ loaderData }: Route.ComponentProps) => {
	const { post } = loaderData;

	return (
		<div className="max-w-3xl mx-auto px-6 py-12 bg-gray-900">
			{/* টাইটেল এবং ডেট */}
			<h1 className="text-3xl font-bold text-blue-400 mb-2">
				{post.title}
			</h1>
			<p className="text-sm text-gray-400 mb-6">
				{new Date(post.date).toLocaleDateString()}
			</p>

			{/* ইমেজ রেন্ডারিং */}
			<img
				src={post.image}
				alt={post.title}
				className="w-full h-64 object-cover mb-4 rounded-lg"
			/>

			{/* বডি */}
			<div className="prose prose-invert max-w-none mb-12">
				<ReactMarkdown>
					{post.body || "Content coming soon..."}
				</ReactMarkdown>
			</div>

			{/* ব্যাক বাটন */}
			<div className="text-center">
				<Link
					to="/blog"
					className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
				>
					← Go Back to Posts
				</Link>
			</div>
		</div>
	);
};

export default BlogPostDetailsPage;
