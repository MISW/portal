import React, { useCallback, useMemo, useState } from 'react';
import type { User } from 'models/user';
import { CardSvg } from 'components/CardSvg';
import { TextInput } from 'components/design/TextInput';
import { Button, LinkButton } from 'components/design/Button';
import miswlogo from 'assets/mislogo.png';

export const EditCard: React.VFC<{
  readonly user?: User;
  readonly onPublish?: (props: { readonly twitterScreenName?: string; readonly discordID?: string }) => void;
  readonly onUnpublish?: () => void;
}> = ({ user, onPublish, onUnpublish }) => {
  const [screenName, setScreenName] = useState(user?.twitterScreenName ?? '');
  const handleScreenNameChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((ev) => {
    setScreenName(ev.target.value);
  }, []);
  const canonicalScreenName = useMemo(() => {
    if (screenName.length === 0) return undefined;
    if (screenName.startsWith('@')) return screenName.slice(1).trim();
    return screenName.trim();
  }, [screenName]);

  const [discordID, setDiscordID] = useState(user?.discordId ?? '');
  const [discordIDModified, setDidcordIDModified] = useState(false);
  const handleDiscordIDChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((ev) => {
    setDiscordID(ev.target.value);
  }, []);
  const handleDiscordIDBlur = useCallback(() => setDidcordIDModified(true), []);
  const canonicalDiscordID = useMemo(() => {
    if (discordID.length === 0) return undefined;
    return discordID.trim();
  }, [discordID]);
  const discordIDError = useMemo(() => {
    if (!discordIDModified) return;
    if (!/.*#\d{4}/.test(canonicalDiscordID ?? '')) return 'discord idの形式が不正です';
  }, [discordIDModified, canonicalDiscordID]);

  const handlePublish = useCallback(() => {
    onPublish?.({
      twitterScreenName: canonicalScreenName,
      discordID: canonicalDiscordID,
    });
  }, [onPublish, canonicalScreenName, canonicalDiscordID]);

  const shareURL = new URL(`/card/${user?.id}`, globalThis?.location?.href ?? 'https://example.com').href;

  const imageURL = new URL(`/card-image/${user?.id}`, globalThis?.location?.href ?? 'https://example.com').href;

  const handleCopy = useCallback(() => {
    if (window && navigator.clipboard) {
      navigator.clipboard.writeText(imageURL);
    }
  }, [imageURL]);

  return (
    <div className="mx-auto w-full max-w-screen-lg flex flex-col space-y-4">
      <h2 className="mx-4 text-4xl">会員証</h2>
      {user != null && (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="edit-card-twitter-screen-name" className="ml-4 text-gray-600 dark:text-gray-300">
              TwitterのID(スクリーンネーム)
            </label>
            <TextInput
              id="edit-card-twitter-screen-name"
              className="mt-2 bg-gray-200 dark:bg-gray-900"
              placeholder="@hogehoge"
              value={screenName}
              onChange={handleScreenNameChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="edit-card-discord-id" className="ml-4 text-gray-600 dark:text-gray-300">
              Discord ID
            </label>
            <TextInput
              id="edit-card-discord-id"
              className="mt-2 bg-gray-200 dark:bg-gray-900"
              placeholder="name#0123"
              value={discordID}
              onChange={handleDiscordIDChange}
              onBlur={handleDiscordIDBlur}
            />
            {discordIDError && <p className="ml-4 text-red-500">{discordIDError}</p>}
          </div>
          <div className="border-2 border-gray-600">
            <CardSvg
              width="100%"
              avatarUrl={user.avatar?.url}
              miswLogoUrl={miswlogo.src}
              generation={user.generation}
              handle={user.handle}
              workshops={user.workshops}
              squads={user.squads}
              twitterScreenName={canonicalScreenName}
              discordId={canonicalDiscordID}
            />
          </div>
          <div className="grid auto-cols-fr auto-rows-fr gap-4 md:grid-flow-col">
            <Button color="blue" disabled={user.cardPublished} onClick={handlePublish}>
              公開する
            </Button>
            <Button color="red" disabled={!user.cardPublished} onClick={onUnpublish}>
              非公開にする
            </Button>
          </div>
          {user.cardPublished && (
            <div className="border-t-2 border-gray-500 pt-4 grid auto-cols-fr auto-rows-fr gap-4 md:grid-flow-col">
              <LinkButton color="blue" target="_blank" rel="noreferrer" href={`https://twitter.com/share?url=${encodeURIComponent(shareURL)}`}>
                Twitterでシェアする
              </LinkButton>
              <Button color="green" onClick={handleCopy}>
                画像のリンクをコピー
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
