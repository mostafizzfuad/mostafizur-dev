import type { PostMeta } from "~/types";
import { Link } from "react-router";

const PostCard = ({ post }: { post: PostMeta }) => {
	return (
		<article
			key={post.slug}
			className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700"
		>
			<h3 className="text-2xl font-semibold text-blue-400 mb-2">
				{post.title}
			</h3>
			<p className="text-sm text-gray-400 mb-3">
				{new Date(post.date).toLocaleDateString()}
			</p>
			<p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
			<Link
				to={`/blog/${post.slug}`}
				className="text-blue-300 hover:text-blue-200 hover:underline text-sm font-medium"
			>
				Read More →
			</Link>
		</article>
	);
};

export default PostCard;
