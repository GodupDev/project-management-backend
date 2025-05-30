import permissionRoutes from "./permission.routes.js";
import roleRoutes from "./role.routes.js";
import rolePermissionRoutes from "./rolePermission.routes.js";
import authRoutes from "./auth.routes.js";

// Use the routes
const setupRoutes = (app) => {
  // Sử dụng các routes
  app.use("/api/permissions", permissionRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/role-permissions", rolePermissionRoutes);
  app.use("/api/auth", authRoutes);
};
export default setupRoutes;