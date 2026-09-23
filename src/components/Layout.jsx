import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function Layout({ profile, user, topbarPlaceholder, notifications, children }) {
  return (
    <div className="min-h-screen w-full flex bg-bg">
      <Sidebar profile={profile} user={user} />
      <div className="flex-grow flex flex-col min-w-0">
        <Topbar placeholder={topbarPlaceholder} notifications={notifications} />
        <div className="flex-grow overflow-auto p-10 box-border">{children}</div>
      </div>
    </div>
  );
}
