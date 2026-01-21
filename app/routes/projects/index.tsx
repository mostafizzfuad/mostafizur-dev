import type { Project } from "~/types";
import type { Route } from "./+types";
import ProjectCard from "~/components/project-card";

// Loader ফাংশন (সার্ভার সাইডে রান হবে)
export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
	const res = await fetch("http://localhost:8000/projects");
	const data = await res.json();
	return { projects: data };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
	const { projects } = loaderData;
	// console.log(projects);

	return (
		<>
			<h2 className="text-3xl font-bold mb-8 text-white">🚀 Projects</h2>

			<div className="grid gap-6 sm:grid-cols-2">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</>
	);
};
export default ProjectsPage;
