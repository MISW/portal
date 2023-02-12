import * as React from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';

type SvgPosition = {
  readonly x: number;
  readonly y: number;
};

type SvgSize = {
  readonly width: number;
  readonly height: number;
};

const SvgIcon: React.VFC<
  {
    readonly icon: IconDefinition;
    readonly size: number;
  } & SvgPosition
> = ({ x, y, size, icon }) => {
  const [width, height, , , paths] = icon.icon;
  const normalizedPaths = [paths].flat();

  return (
    <g transform={`translate(${x},${y}) scale(${size / width},${size / height})`}>
      {normalizedPaths.map((path, i) => (
        <path key={i} d={path} />
      ))}
    </g>
  );
};

const Avatar: React.VFC<
  {
    readonly avatarUrl?: string;
    readonly radius?: number;
  } & SvgPosition &
    SvgSize
> = ({ x, y, width, height, radius = 10, avatarUrl }) =>
  avatarUrl != null ? (
    <>
      <clipPath id="avatar">
        <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} />
      </clipPath>
      <image clipPath="url(#avatar)" href={avatarUrl} x={x} y={y} width={width} height={height} />
    </>
  ) : (
    <rect fill="#9ca3af" x={x} y={y} width={width} height={height} rx={radius} ry={radius} />
  );

const CheckBox: React.VFC<{
  readonly checked: boolean;
}> = ({ checked }) => (
  <>
    <rect stroke="#4B5563" strokeWidth={2} fill="transparent" x={0} y={-20} width={20} height={20} rx={2} ry={2} />
    {checked && (
      <path
        stroke="blue"
        fill="transparent"
        strokeWidth={3}
        d="
        M 4 -14.5
        L 9 -5
        l 23 -20
      "
      />
    )}
  </>
);

export const CardSvg: React.VFC<{
  readonly width?: string;
  readonly height?: string;
  readonly avatarUrl?: string;
  readonly miswLogoUrl: string;
  readonly generation: number;
  readonly handle: string;
  readonly workshops: readonly string[];
  readonly squads: readonly string[];
  readonly twitterScreenName?: string;
  readonly discordId?: string;
}> = ({ width, height, avatarUrl, miswLogoUrl, generation, handle, workshops, squads, twitterScreenName, discordId }) => (
  <svg version="1.1" baseProfile="full" width={width} height={height} viewBox="0 0 1200 630" xmlns="https://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white" />

    <Avatar avatarUrl={avatarUrl} x={30} y={30} width={150} height={150} />

    <g color="#111827">
      <text x={240} y={150} fill="currentcolor" fontSize={100}>
        {generation}
        <tspan fontSize={60} fontWeight="normal">
          代
        </tspan>
      </text>
      <text x={785} y={150} fontSize={80} fill="currentcolor" textAnchor="middle">
        {handle}
      </text>
      <line x1={210} y1={175} x2={1200 - 30} y2={175} stroke="black" strokeWidth={5} strokeLinecap="round" />
    </g>

    <g color="#111827" transform="translate(210,300)">
      <g>
        <text fill="currentcolor" fontSize={30}>
          {[...'研究会'].map((c, i) => (
            <tspan key={c} dx={i === 0 ? 0 : 10}>
              {c}
            </tspan>
          ))}
        </text>
        <g transform="translate(150,0)">
          <CheckBox checked={workshops.includes('プログラミング')} />
          <text dx={40} fill="currentcolor" fontSize={30}>
            プログラミング
          </text>
        </g>
        <g transform="translate(450,0)">
          <CheckBox checked={workshops.includes('MIDI')} />
          <text dx={40} fill="currentcolor" fontSize={30}>
            MIDI
          </text>
        </g>

        <g transform="translate(600,0)">
          <CheckBox checked={workshops.includes('CG')} />
          <text dx={40} fill="currentcolor" fontSize={30}>
            CG
          </text>
        </g>
      </g>
      <g transform="translate(0,70)">
        <text x={40} fill="currentcolor" fontSize={30}>
          班
        </text>
        <line stroke="currentcolor" strokeWidth={2} strokeLinecap="round" x1={140} y1={5} x2={690} y2={5} />
        <text x={150} width={690 - 140 - 40} fill="currentcolor" fontSize={30}>
          {squads.map((squad, i) =>
            i === 0 ? (
              squad
            ) : (
              <>
                <tspan dx={5}>,</tspan>
                <tspan dx={10}>{squad}</tspan>
              </>
            ),
          )}
        </text>
      </g>
    </g>

    <g color="#111827" transform="translate(210,500)">
      {[
        twitterScreenName != null ? (
          <>
            <SvgIcon icon={faTwitter} x={40} y={-23} size={30} />
            <text fill="currentcolor" x={150} fontSize={30}>
              @{twitterScreenName}
            </text>
          </>
        ) : null,
        discordId != null ? (
          <>
            <SvgIcon icon={faDiscord} x={40} y={-23} size={30} />
            <text fill="currentcolor" x={150} fontSize={30}>
              {discordId}
            </text>
          </>
        ) : null,
      ]
        .filter((x) => x != null)
        .map((el, i) => (
          <g key={i} transform={`translate(0,${70 * i})`}>
            {el}
          </g>
        ))}
    </g>

    <image href={miswLogoUrl} x={1200 - 600 / 3 - 30} y={630 - 243 / 3 - 15} width={600 / 3} height={243 / 3} />
  </svg>
);
