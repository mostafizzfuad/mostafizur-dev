import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Mostafizur's Portfolio" },
		{
			name: "description",
			content: "Frontend, Backend and Full Stack Projects",
		},
	];
}

const HomePage = () => {
	return (
		<section>
			<h1>Welcome</h1>
		</section>
	);
};

export default HomePage;
