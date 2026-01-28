import { useState } from "react";
import type { Project, StrapiProject, StrapiResponse } from "~/types";
import type { Route } from "./+types";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "~/components/project-card";
import Pagination from "~/components/Pagination";

// Loader ফাংশন (সার্ভার সাইডে রান হবে)
export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
	// Strapi API থেকে ফেচ করা (populate=* দিয়ে রিলেশন/ইমেজ আনা হচ্ছে)
	const res = await fetch(
		`${import.meta.env.VITE_API_URL}/projects?populate=*`,
	);

	const json: StrapiResponse<StrapiProject> = await res.json();
	// ডেটা ম্যাপিং
	const projects = json.data.map((item) => ({
		id: item.id,
		documentId: item.documentId, // Strapi v5 Document ID
		title: item.title,
		description: item.description,
		// ইমেজ URL ঠিক করা
		image: item.image?.url
			? `${item.image.url}`
			: "/images/no-image.png", // ব্যাকআপ ইমেজ
		url: item.url,
		date: item.date,
		category: item.category,
		featured: item.featured,
	}));

	return { projects };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
	const { projects } = loaderData;
	// console.log(projects);

	// ********************** ক্যাটাগরি ফিল্টারিং এর জন্য state এবং লজিক ********************** //
	const [selectedCategory, setSelectedCategory] = useState("All");

	// ইউনিক ক্যাটাগরি বের করা
	const categories = ["All", ...new Set(projects.map((p) => p.category))];

	// ক্যাটাগরি অনুযায়ী ফিল্টার
	const filteredProjects =
		selectedCategory === "All"
			? projects
			: projects.filter((p) => p.category === selectedCategory);

	// ********************** Pagination এর জন্য state এবং লজিক ********************** //
	const [currentPage, setCurrentPage] = useState(1);
	const projectsPerPage = 6; // আপাতত ৬ রাখছি যাতে লেআউট সুন্দর দেখায়

	// Pagination logic (ফিল্টার করা প্রজেক্টের ওপর ভিত্তি করে)
	// মোট পেজ সংখ্যা বের করা (Math.ceil ব্যবহার করা হয়েছে যাতে পূর্ণসংখ্যা পাওয়া যায়)
	const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

	// বর্তমান পেজের প্রজেক্ট বের করা
	const indexOfLast = currentPage * projectsPerPage;
	const indexOfFirst = indexOfLast - projectsPerPage;
	const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

	return (
		<>
			<h2 className="text-3xl font-bold mb-8 text-white">🚀 Projects</h2>

			{/* Category Filter */}
			<div className="flex flex-wrap gap-2 mb-8">
				{categories.map((cat) => (
					<button
						key={cat}
						onClick={() => {
							setSelectedCategory(cat);
							setCurrentPage(1); // ক্যাটাগরি পাল্টালে পেজ ১-এ ফিরে যাবে
						}}
						className={`px-3 py-1 rounded text-sm transition cursor-pointer ${
							selectedCategory === cat
								? "bg-blue-600 text-white"
								: "bg-gray-700 text-gray-200 hover:bg-gray-600"
						}`}
					>
						{cat}
					</button>
				))}
			</div>

			{/* অ্যানিমেশন র‍্যাপার */}
			<AnimatePresence mode="wait">
				<motion.div layout className="grid gap-6 sm:grid-cols-2">
					{currentProjects.map((project) => (
						// প্রতিটি আইটেমের জন্য motion div
						<motion.div
							key={project.id}
							layout
							initial={{ opacity: 0, scale: 0.9 }} // অপশনাল: শুরুতে একটু ছোট ও ঝাপসা থাকবে
							animate={{ opacity: 1, scale: 1 }} // অপশনাল: স্বাভাবিক হবে
							exit={{ opacity: 0, scale: 0.9 }} // অপশনাল: যাওয়ার সময় ছোট হয়ে মিলিয়ে যাবে
							transition={{ duration: 0.3 }}
						>
							<ProjectCard project={project} />
						</motion.div>
					))}
				</motion.div>
			</AnimatePresence>

			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
			/>
		</>
	);
};

export default ProjectsPage;
