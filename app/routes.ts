import {
	type RouteConfig,
	index,
	route,
	layout,
} from "@react-router/dev/routes";

export default [
	// ১. হোম লেআউট (শুধু হোম পেজের জন্য)
	layout("routes/layouts/home.tsx", [index("routes/home/index.tsx")]),

	// ২. মেইন লেআউট (বাকি সব পেজের জন্য)
	layout("routes/layouts/main.tsx", [
		route("about", "./routes/about/index.tsx"),
		route("contact", "./routes/contact/index.tsx"),
		route("projects", "./routes/projects/index.tsx"),
		route("blog", "./routes/blog/index.tsx"),
		route("projects/:id", "./routes/projects/details.tsx"),
	]),
] satisfies RouteConfig;
