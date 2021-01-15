import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Transition, Menu } from "@headlessui/react";
import { MdAccountCircle, MdLock } from "react-icons/md";
import MISWLogo from "../../assets/misw_logo.svg";

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
const UserDropdown: React.VFC<UserDropdownProps> = ({ logout }) => (
  <div className="relative">
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button
            className="w-12 h-12 rounded-full bg-gray-100 bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10 active:bg-opacity-20"
            aria-label="ユーザーメニューを開く"
          >
            <MdAccountCircle className="m-auto w-8 h-8 text-gray-100" />
          </Menu.Button>
          <Transition
            show={open}
            className="absolute top-12 right-0"
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-95"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="w-32 rounded-sm shadow outline-none divide-y bg-white dark:bg-gray-800 divide-gray-200 dark:divide-gray-600"
            >
              <Link passHref href="/profile">
                <Menu.Item as="a">
                  {({ active }) => (
                    <p
                      className={clsx(
                        "w-full p-4 text-xs",
                        active && "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      プロフィール
                    </p>
                  )}
                </Menu.Item>
              </Link>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={clsx(
                      "w-full p-4 text-left text-xs text-red-500",
                      active && "bg-gray-100 dark:bg-gray-700"
                    )}
                    onClick={logout}
                  >
                    ログアウト
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  </div>
);

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
