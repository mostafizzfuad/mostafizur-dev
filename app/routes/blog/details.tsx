import ReactMarkdown from "react-markdown";
import type { Route } from "./+types/details"; // টাইপ জেনারেশন
import type { PostMeta } from "~/types";
import { Link } from "react-router";

export async function loader({ request, params }: Route.LoaderArgs) {
	const { slug } = params;

	// ১. মেটাডেটা ফেচ করা
	// নোট: তোমার JSON ফাইলের পাথ অনুযায়ী URL ঠিক করো (যেমন: /posts-meta.json অথবা /data/posts-meta.json)
	const url = new URL("/posts-meta.json", request.url);
	const res = await fetch(url.href);

	if (!res.ok) {
		throw new Error("Failed to fetch posts");
	}

	const index = await res.json();
	const postMeta = index.find((post: PostMeta) => post.slug === slug);

	// পোস্ট না পাওয়া গেলে 404
	if (!postMeta) {
		throw new Response("Not found", { status: 404 });
	}

	// ২. মার্কডাউন কন্টেন্ট ডায়নামিক ইমপোর্ট করা (?raw ব্যবহার করে স্ট্রিং হিসেবে আনা হচ্ছে)
	const markdown = await import(`../../posts/${slug}.md?raw`);

	return {
		postMeta, // টাইটেল, তারিখ, ক্যাটাগরি ইত্যাদি
		markdown: markdown.default, // পোস্টের মূল লেখা (Body content)
	};
}

const BlogPostDetailsPage = ({ loaderData }: Route.ComponentProps) => {
	const { postMeta, markdown } = loaderData;
	console.log(postMeta, markdown);

	return (
		<div className="max-w-3xl mx-auto px-6 py-12 bg-gray-900">
			{/* টাইটেল এবং ডেট */}
			<h1 className="text-3xl font-bold text-blue-400 mb-2">
				{postMeta.title}
			</h1>
			<p className="text-sm text-gray-400 mb-6">
				{new Date(postMeta.date).toLocaleDateString()}
			</p>

			{/* মার্কডাউন কন্টেন্ট (prose ক্লাস দিয়ে স্টাইল করা হবে) */}
			<div className="prose prose-invert max-w-none mb-12">
				<ReactMarkdown>{markdown}</ReactMarkdown>
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
