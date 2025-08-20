import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/ranking.tsx"),
  route("analytics", "routes/analytics/index.tsx"),
  route("favorites", "routes/favorites.tsx")
] satisfies RouteConfig;
