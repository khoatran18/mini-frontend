
"use client";
import withAuth from "@/lib/with-auth";

const SellerAdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Seller Admin Dashboard</h1>
      {/* Add seller_admin-specific dashboard content here */}
    </div>
  );
};

export default withAuth(SellerAdminDashboard, ["seller_admin"]);
