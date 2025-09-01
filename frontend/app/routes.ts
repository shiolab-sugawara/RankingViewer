import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/ranking/route.tsx"),
  route("analytics", "routes/analytics/route.tsx"),
  route("favorites", "routes/favorites/route.tsx")
] satisfies RouteConfig;
