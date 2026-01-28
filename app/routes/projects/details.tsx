import type { Route } from "./+types/details";
import type { Project, StrapiResponse, StrapiProject } from "~/types";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
	const { id } = params; // URL থেকে documentId নেওয়া হচ্ছে

	// Strapi-তে নির্দিষ্ট documentId দিয়ে ফিল্টার করা হচ্ছে
	const res = await fetch(
		`${import.meta.env.VITE_API_URL}/projects?filters[documentId][$eq]=${id}&populate=*`,
	);

	if (!res.ok) {
		throw new Error("Failed to fetch project");
	}

	const json: StrapiResponse<StrapiProject> = await res.json();

	// যদি কোনো ডেটা না পাওয়া যায়, 404 রিটার্ন করো
	if (!json.data.length) {
		throw new Response("Not Found", { status: 404 });
	}

	const item = json.data[0];

	// Strapi ফরম্যাট থেকে আমাদের Project ফরম্যাটে কনভার্ট করা
	const project: Project = {
		id: item.id,
		documentId: item.documentId,
		title: item.title,
		description: item.description,
		image: item.image?.url ? `${item.image.url}` : "/images/no-image.png",
		url: item.url,
		date: item.date,
		category: item.category,
		featured: item.featured,
	};

	return { project };
}

const ProjectDetailsPage = ({ loaderData }: Route.ComponentProps) => {
	const { project } = loaderData;

	return (
		<>
			{/* ১. ব্যাক টু প্রজেক্টস বাটন */}
			<Link
				to="/projects"
				className="flex items-center text-blue-400 hover:text-blue-500 mb-6 transition"
			>
				<FaArrowLeft className="mr-2" />
				Back to Projects
			</Link>

			{/* ২. মেইন কন্টেন্ট গ্রিড */}
			<div className="grid md:grid-cols-2 gap-8 items-start">
				{/* বাম পাশ: প্রজেক্ট ইমেজ */}
				<div>
					<img
						src={project.image}
						alt={project.title}
						className="w-full rounded-lg shadow-md"
					/>
				</div>

				{/* ডান পাশ: প্রজেক্ট ইনফো */}
				<div>
					<h1 className="text-3xl font-bold text-blue-400 mb-4">
						{project.title}
					</h1>
					<p className="text-gray-300 text-sm mb-4">
						{new Date(project.date).toLocaleDateString()} •{" "}
						{project.category}
					</p>
					<p className="text-gray-200 mb-6">{project.description}</p>

					{/* এক্সটার্নাল লিংক (নতুন ট্যাবে ওপেন হবে) */}
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
					>
						View Live Site →
					</a>
				</div>
			</div>
		</>
	);
};

export default ProjectDetailsPage;
