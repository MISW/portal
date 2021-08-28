import React, { useState, useLayoutEffect } from "react";

export const NoSSR: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false);
  useLayoutEffect(() => {
    setVisible(true);
  }, []);

  return <>{visible && children}</>;
};
