import React from "react";
import { Card } from "components/ui";

type SettingsCardProps = Readonly<{
  label: string;
}>;

export const SettingsCard: React.FC<SettingsCardProps> = ({
  children,
  label,
}) => (
  <div className="max-w-screen-md">
    <h3 className="mx-4 text-xl">{label}</h3>
    <Card className="mt-2 border-t border-b md:border-l md:border-r md:rounded-md flex flex-col divide-y">
      {children}
    </Card>
  </div>
);

type SettingsCardItemProps = Readonly<{
  label: string;
  htmlFor?: string;
}>;

export const SettingsCardItem: React.FC<SettingsCardItemProps> = ({
  label,
  htmlFor,
  children,
}) => (
  <section className="w-full p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
    <div className="w-80">
      <label className="font-bold" htmlFor={htmlFor}>
        {label}
      </label>
    </div>
    <div className="flex-grow">{children}</div>
  </section>
);
