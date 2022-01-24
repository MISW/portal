import { Avatar } from 'models/user';
import { Card } from 'models/card';

function assertsIsObject(x: unknown): asserts x is Record<string, unknown> {
    if (typeof x !== 'object' || x === null)
        throw new Error('given value is not an object');
}

function assertsIsArray(x: unknown): asserts x is Array<unknown>;
function assertsIsArray<T>(
    x: unknown,
    assert: (y: unknown) => asserts y is T,
): asserts x is Array<T>;
function assertsIsArray(
    x: unknown,
    assert?: (y: unknown) => void,
): asserts x is unknown {
    if (!Array.isArray(x)) throw new Error('given value is not an array');
    if (assert != null) x.forEach(assert);
}

function assertsIsString(x: unknown): asserts x is string {
    if (typeof x !== 'string') throw new Error('given value is not a string');
}

function assertsIsNumber(x: unknown): asserts x is number {
    if (typeof x !== 'number' || Number.isNaN(x))
        throw new Error('given value is not a number');
}

function assertsOptional<T>(
    x: unknown,
    assert: (y: unknown) => asserts y is T,
): asserts x is T | undefined {
    if (x != null) assert(x);
}

export function decodeAvatar(o: unknown): Avatar {
    assertsIsObject(o);

    const { thumbnail_url: thumbnailUrl, url } = o;

    assertsIsString(thumbnailUrl);
    assertsIsString(url);

    return {
        thumbnailUrl,
        url,
    };
}

export function decodeCard(o: unknown): Card {
    assertsIsObject(o);

    const {
        id,
        generation,
        handle,
        avatar: avatarObj,
        workshops,
        squads,
        twitter_screen_name: twitterScreenName,
        discord_id: discordID,
    } = o;
    assertsIsNumber(id);
    assertsIsNumber(generation);
    assertsIsString(handle);

    const avatar = avatarObj != null ? decodeAvatar(avatarObj) : undefined;

    assertsIsArray(workshops, assertsIsString);
    assertsIsArray(squads, assertsIsString);

    assertsOptional(twitterScreenName, assertsIsString);
    assertsOptional(discordID, assertsIsString);

    return {
        id,
        generation,
        handle,
        ...(avatar != null ? { avatar } : {}),
        workshops,
        squads,
        ...(twitterScreenName != null ? { twitterScreenName } : {}),
        ...(discordID != null ? { discordID } : {}),
    };
}
