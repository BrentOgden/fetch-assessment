import React, { useState } from 'react';
import { IoPawOutline } from 'react-icons/io5';

function PawIcon({ dogId, onToggle }) {
  const [active, setActive] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();

    if (typeof onToggle === 'function') {
      onToggle();
    }
    setActive(!active);
  };

  return (
    <div className="text-4xl pl-5 pt-3 cursor-pointer" onClick={handleClick}>
      <IoPawOutline color={active ? 'orange' : 'black'} />
    </div>
  );
}

export default PawIcon;
