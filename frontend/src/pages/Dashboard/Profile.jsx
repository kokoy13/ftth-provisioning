import { User, Mail, Shield, Calendar } from "lucide-react";
import { useAuth } from "../../AuthContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const Profile = () => {
  const { user } = useAuth();

  const details = [
    { label: "Username", value: user?.username, icon: User },
    { label: "Full Name", value: user?.fullName || "—", icon: User },
    { label: "Email", value: user?.email || "—", icon: Mail },
    { label: "Role", value: user?.role === "admin" ? "Super Admin" : "Field Technician", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your account information.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Avatar */}
          <div className="px-6 pb-6 pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-md">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : user?.username
                    ? user.username.charAt(0).toUpperCase()
                    : "U"}
                </div>
              </div>
              <div className="ml-4 pb-1">
                <h2 className="text-lg font-bold text-slate-800">{user?.fullName || user?.username}</h2>
                <p className="text-sm text-slate-400">{user?.role === "admin" ? "Super Admin" : "Field Technician"}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {details.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
