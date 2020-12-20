import React from "react";
import type { NextPage } from "next";
import { MdAccountCircle } from "react-icons/md";
import MISWLogo from "../assets/misw_logo.svg";

const Home: NextPage = () => {
  return (
    <div className="w-screen">
      <header className="w-full">
        <div className="h-16 px-4 py-2 bg-gray-800">
          <div className="mx-auto w-full max-w-screen-lg flex flex-row justify-between items-center">
            <div aria-hidden />
            <div>
              <a className="block transform translate-x-4 px-4 rounded-lg hover:bg-opacity-20 hover:bg-blue-700">
                <MISWLogo className="h-12" />
              </a>
            </div>
            <div>
              <button className="w-12 h-12 rounded-full hover:bg-opacity-10 hover:bg-gray-100">
                <MdAccountCircle className="m-auto w-8 h-8 text-gray-100" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="w-full h-32 max-w-screen-lg flex flex-row">
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-black" />
        </div>
      </main>
      <footer className="mb-4">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Copyright ©{" "}
          <a
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
            href="https://misw.jp"
          >
            MISW
          </a>{" "}
          2020.
        </p>
      </footer>
    </div>
  );
};

export default Home;
