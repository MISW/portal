import React, { useState, useLayoutEffect } from 'react';

export const NoSSR: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  useLayoutEffect(() => {
    setVisible(true);
  }, []);

  return <>{visible && children}</>;
};
