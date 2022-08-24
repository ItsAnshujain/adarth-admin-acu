import { useEffect, useRef } from 'react';

const useOutsideClick = setShowMenu => {
  const domNode = useRef();
  useEffect(() => {
    const handler = event => {
      if (!domNode.current?.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, [setShowMenu]);

  return domNode;
};

export default useOutsideClick;
