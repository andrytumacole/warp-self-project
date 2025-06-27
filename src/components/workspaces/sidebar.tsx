import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import UserAvatarButton from "../user/user-avatar-button";
import SidebarButton from "./sidebar-button";
import Switcher from "./switcher";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathName = usePathname();
  return (
    <aside className="w-[70px] h-full bg-gray-900 text-white flex flex-col gap-y-4 items-center pt-[9px]">
      <Switcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathName.includes("/workspace")}
      />
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="flex items-center justify-center gap-y-1 mt-auto pb-4">
        <UserAvatarButton />
      </div>
    </aside>
  );
}

export default Sidebar;
