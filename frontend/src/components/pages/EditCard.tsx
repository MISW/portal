import React, { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import type { User } from "models/user";
import { CardSvg } from "components/CardSvg";
import { TextInput } from "components/design/TextInput";

export const EditCard: React.VFC<{
  readonly user?: User;
  readonly onPublish?: (twitterScreenName?: string) => void;
  readonly onUnpublish?: () => void;
}> = ({ user, onPublish, onUnpublish }) => {
  const [screenName, setScreenName] = useState(user?.twitterScreenName ?? "");
  const handleScreenNameChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((ev) => {
    setScreenName(ev.target.value);
  }, []);
  const canonicalScreenName = useMemo(() => {
    if (screenName.length === 0) return undefined;
    if (screenName.startsWith("@")) return screenName.slice(1).trim();
    return screenName.trim();
  }, [screenName]);

  const handlePublish = useCallback(() => {
    onPublish?.(canonicalScreenName);
  }, [onPublish, canonicalScreenName]);

  const shareURL = new URL(
    `/card/${user?.id}`,
    globalThis?.location?.href ?? "https://example.com"
  ).href;

  return (
    <div className="mx-auto mt-8 w-full max-w-screen-md flex flex-col space-y-4">
      <h2 className="mx-4 text-4xl">会員証</h2>
      {user != null && (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="ml-4 text-gray-600 dark:text-gray-300">
              TwitterのID(スクリーンネーム)
            </label>
            <TextInput
              className="mt-2 bg-gray-200 dark:bg-gray-900"
              placeholder="@hogehoge"
              value={screenName}
              onChange={handleScreenNameChange}
            />
          </div>
          <div className="border-2 border-gray-600">
            <CardSvg
              width="100%"
              avatarUrl={user.avatar?.url}
              generation={user.generation}
              handle={user.handle}
              workshops={user.workshops}
              squads={user.squads}
              twitterScreenName={canonicalScreenName}
              discordId={user.discordId}
            />
          </div>
          <div className="flex flex-row space-x-4">
            <button
              className={clsx(
                "w-48 rounded px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-900 dark:disabled:text-white disabled:bg-gray-300 dark:disabled:bg-gray-700"
              )}
              disabled={user.cardPublished}
              onClick={handlePublish}
            >
              公開する
            </button>
            <button
              className={clsx(
                "w-48 rounded px-4 py-2 text-white bg-red-500 hover:bg-red-600 active:bg-red-700",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-900 dark:disabled:text-white disabled:bg-gray-300 dark:disabled:bg-gray-700"
              )}
              disabled={!user.cardPublished}
              onClick={onUnpublish}
            >
              非公開にする
            </button>
          </div>
          {user.cardPublished && (
            <div className="border-t-2 border-gray-500">
              <a
                className="mt-4 block w-48 text-center rounded px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                target="_blank"
                rel="noreferrer"
                href={`https://twitter.com/share?url=${encodeURIComponent(
                  shareURL
                )}`}
              >
                Twitterでシェアする
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
