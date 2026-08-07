import { User } from "@/context/AppContext";
import { UserCircle } from "lucide-react";
import React from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  user: User | null | undefined;
  size?: AvatarSize;
  online?: boolean;
}

const sizes: Record<AvatarSize, { box: string; icon: string }> = {
  sm: { box: "w-8 h-8", icon: "w-4 h-4" },
  md: { box: "w-11 h-11", icon: "w-6 h-6" },
  lg: { box: "w-20 h-20", icon: "w-12 h-12" },
};

const Avatar = ({ user, size = "md", online }: AvatarProps) => {
  const { box, icon } = sizes[size];

  return (
    <div className="relative shrink-0">
      <div
        className={`${box} rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center`}
      >
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <UserCircle
            className={`${icon} text-gray-500 dark:text-gray-400`}
          />
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 ring-2 ring-white dark:ring-[#0f0f0f]" />
      )}
    </div>
  );
};

export default Avatar;
