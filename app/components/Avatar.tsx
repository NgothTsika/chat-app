import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="relative inline-block rounded-full  overflow-hidden h-9 w-9 md:h-9 md:w-9">
        <Image
          alt="Avatar"
          fill
          src={user?.image || "/images/avatar.png"}
          sizes="15"
        />
      </div>
      {isActive && (
        <span className=" absolute  block rounded-full bg-green-500 ring-2 right-0 top-0 h-2 w-2 md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
