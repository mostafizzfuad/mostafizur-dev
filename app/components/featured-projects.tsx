import type { Project } from "~/types";
import ProjectCard from "~/components/project-card";

const FeaturedProjects = ({
	projects,
	count,
}: {
	projects: Project[];
	count: number;
}) => {
	// ১. ফিচারড প্রজেক্ট ফিল্টার করা এবং সংখ্যা লিমিট করা
	const featured = projects.filter((p) => p.featured).slice(0, count);

	return (
		<section>
			<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
				🌟 Featured Projects
			</h2>
			<div className="grid gap-6 sm:grid-cols-2">
				{/* ২. ফিল্টার করা প্রজেক্টগুলো কার্ড হিসেবে দেখানো */}
				{featured.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</section>
	);
};

export default FeaturedProjects;
