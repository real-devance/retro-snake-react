import React from 'react';
import { MovementDirectionType } from '../../../types/types';
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from '../icons';

interface DirectionBtnProps {
  direction: MovementDirectionType;
  setDirection: React.Dispatch<React.SetStateAction<MovementDirectionType>>;
}

function DirectionBtn ({direction, setDirection} : DirectionBtnProps){
  const handleClick = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setDirection(direction);
  };

  // Determine which icon to display based on direction
  const renderIcon = () => {
    switch (direction) {
      case 'up':
        return <ArrowUpIcon />;
      case 'down':
        return <ArrowDownIcon />;
      case 'left':
        return <ArrowLeftIcon />;
      case 'right':
        return <ArrowRightIcon />;
      default:
        return null;
    }
  };

  return (
    <button
      name={direction}
      className="w-12 min-[385px]:w-14 aspect-square 
      bg-accent border-2 outline-transparent border-none rounded-md"
      value={direction}
      onClick={(e) => handleClick(e)}
    >
      {renderIcon()}
    </button>
  );
};

export default DirectionBtn;