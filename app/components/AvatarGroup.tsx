import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface AvatarGroupProps {
  users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const slicedUsers = users?.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      <div className="relative inline-block rounded-full  overflow-hidden h-9 w-9 md:h-9 md:w-9">
        {slicedUsers?.map((user, index) => (
          <div
            key={user.id}
            className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
              positionMap[index as keyof typeof positionMap]
            } `}
          >
            <Image
              alt="Avatar"
              fill
              src={user?.image || "/images/avatar.png"}
              sizes="15"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarGroup;
