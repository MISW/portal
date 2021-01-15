import React from "react";
import Link from "next/link";
import { MdAccountCircle, MdLock } from "react-icons/md";
import MISWLogo from "../../assets/misw_logo.svg";
import { DropdownRoot, Dropdown, useDropdown } from "components/Dropdown";

const AdminLink: React.VFC = () => (
  <Link href="/admin">
    <a
      className="w-12 h-12 rounded-full flex bg-opacity-0 bg-red-600 hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-30"
      aria-label="管理者画面を開く"
    >
      <MdLock className="m-auto w-8 h-8 text-red-600" />
    </a>
  </Link>
);

type UserDropdownProps = Readonly<{
  logout?: () => void;
}>;
const UserDropdown: React.VFC<UserDropdownProps> = ({ logout }) => {
  const { rootRef, show, toggle } = useDropdown();
  return (
    <DropdownRoot ref={rootRef}>
      <button
        className="w-12 h-12 rounded-full bg-gray-100 bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10 active:bg-opacity-30 outline-none focus-visible:outline-white"
        role="menu"
        onClick={toggle}
      >
        <MdAccountCircle className="m-auto w-8 h-8 text-gray-100" />
      </button>

      <Dropdown show={show} top="top-12" right="right-0" width="w-24">
        <Link href="/profile">
          <a className="p-4 text-xs">Profile</a>
        </Link>
        <button onClick={logout} className="p-4 text-xs">
          Logout
        </button>
      </Dropdown>
    </DropdownRoot>
  );
};

type HeaderProps = Readonly<{
  logout: () => void;
  userName?: string;
  isAdmin?: boolean;
}>;
export const Header: React.VFC<HeaderProps> = ({
  logout,
  userName,
  isAdmin,
}) => {
  return (
    <div className="w-full h-16 px-4 py-2 shadow bg-gray-800 dark:bg-gray-900">
      <div className="mx-auto w-full flex flex-row justify-between items-center">
        <div>
          <Link href="/">
            <a
              className="sm:px-4 flex justify-center items-center rounded-lg bg-opacity-0 bg-blue-700 hover:bg-opacity-20 active:bg-opacity-30"
              aria-label="ホームに戻る"
            >
              <MISWLogo
                className="flex-1 w-40 h-12"
                style={{
                  filter: "brightness(150%)",
                }}
              />
            </a>
          </Link>
        </div>
        <div className="ml-2 flex-1 flex flex-row justify-end items-center space-x-2">
          {userName != null && (
            <>
              <p className="text-gray-100">{userName}</p>
              {isAdmin && <AdminLink />}
              <UserDropdown logout={logout} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
