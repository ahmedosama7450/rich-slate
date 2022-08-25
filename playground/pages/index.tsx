import type { NextPage } from "next";
import Head from "next/head";

import { Editor } from "../components/Editor";

const Home: NextPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Head>
        <title>RichSlate Playground</title>
        <meta name="description" content="rich-slate playground" />
      </Head>

      <header className="mb-6 flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700 sm:text-3xl">
            Rich Slate
          </h1>
          <p className="mt-1 text-base text-gray-600 sm:text-lg">
            Opinionated rich text editor on top of
            <br />{" "}
            <a href="https://docs.slatejs.org/" className="underline">
              slate
            </a>{" "}
            framework
          </p>
        </div>
      </header>
      <main>
        <Editor />
      </main>

      {/** Github link */}
      <div className="absolute top-0 left-0">
        <div className="relative -top-28 -left-28 h-48 w-48 rotate-45 bg-gray-800"></div>

        <a
          href="https://github.com/ahmedosama7450/rich-slate"
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="absolute top-4 left-4 h-8 w-8"
            src="/GitHub-Mark-Light-64px.png"
            alt="Github Logo"
          />
        </a>
      </div>
    </div>
  );
};

export default Home;
