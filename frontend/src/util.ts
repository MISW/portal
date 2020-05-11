import { labelsInJapanese, UserTableData } from "./user";

export function usersCSV(users: UserTableData[]): string {
  return (
    labelsInJapanese.map(({ label }) => label).join(",") +
    "\n" +
    users
      .map((user) =>
        labelsInJapanese
          .map(({ id }) =>
            JSON.stringify(`${user[id as keyof UserTableData] ?? ""}`)
          )
          .join(",")
      )
      .join("\n")
  );
}

export function saveFile(name: string, data: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type: "text/plain" }));
  a.download = name;

  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function calcPeriod(current: number, diff: number): number {
  const index =
    Math.floor(current / 100) * 2 + ((current % 100) + 2) / 6 - 1 + diff;

  return (index >> 1) * 100 + (index % 2 ? 10 : 4);
}

export const getSuffix = (n: number): string => {
  if ([11, 12, 13].includes(n % 100)) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
  }
  return "th";
};
