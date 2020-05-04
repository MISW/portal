import { labelsInJapanese, UserTableData } from "./user";

export function usersCSV(users: UserTableData[]): string {
  return (
    Object.values(labelsInJapanese).join(",") +
    "\n" +
    users
      .map((user) =>
        Object.keys(labelsInJapanese).map(
          (key) => JSON.stringify(`${user[key as keyof UserTableData] ?? ""}`)
        ).join(",")
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
