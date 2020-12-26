import React from "react";
import Link from "next/link";
import { MdAccountCircle, MdLock } from "react-icons/md";
import MISWLogo from "../../assets/misw_logo.svg";
import {
  DropdownRoot,
  Dropdown,
  DropdownItem,
  useDropdown,
} from "components/Dropdown";

const AdminLink: React.VFC = () => (
  <Link href="/admin">
    <a className="w-12 h-12 rounded-full flex place-items-center hover:bg-opacity-20 hover:bg-red-600 focus:bg-opacity-20 focus:bg-red-600 focus:outline-none">
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
        className="w-12 h-12 rounded-full hover:bg-opacity-10 hover:bg-gray-100 focus:bg-opacity-10 focus:bg-gray-100 focus:outline-none"
        onClick={toggle}
      >
        <MdAccountCircle className="m-auto w-8 h-8 text-gray-100" />
      </button>

      <Dropdown show={show} top="top-12" right="right-0" width="w-24">
        <Link href="/profile" passHref>
          <DropdownItem as="a">
            <p className="p-4 text-xs">Profile</p>
          </DropdownItem>
        </Link>
        <DropdownItem as="button" onClick={logout}>
          <p className="p-4 text-xs">Logout</p>
        </DropdownItem>
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
    <div className="w-full h-16 px-8 py-2 shadow bg-gray-800">
      <div className="mx-auto w-full max-w-screen-lg flex flex-row justify-between items-center">
        <div className="md:flex-1" aria-hidden />
        <div className="flex-1 flex-shrink">
          <Link href="/">
            <a className="flex h-12 px-4 place-content-center rounded-lg hover:bg-opacity-20 hover:bg-blue-700">
              <MISWLogo
                className="flex-1 max-h-12"
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
