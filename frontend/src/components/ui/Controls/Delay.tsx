import React, { useEffect, useState } from "react";

type DelayProps = {
  ms?: number;
};
export const Delay: React.FC<DelayProps> = ({ ms = 500, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => setVisible(true), ms);
    return () => window.clearTimeout(handle);
  }, [ms]);

  return <>{visible && children}</>;
};
