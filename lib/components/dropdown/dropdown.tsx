'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { DropdownProps } from '@/lib/types/componentTypes';

import styles from './dropdown.module.scss';
import arrowIcon from '@/public/images/icons/dropdown-arrow.svg';
import IconButton from "@mui/material/IconButton";
import { ClickAwayListener } from "@mui/base";


import { IoIosClose } from 'react-icons/io';


const Dropdown: React.FC<DropdownProps> = ({ items, className, icon, headerTitle, defaultSelected, queryPushing }) => {
  const [isOpen, setOpen] = useState(true); //false
  const [selectedItem, setSelectedItem] = useState(defaultSelected);
  const toggleDropdown = () => {
    //setOpen(!isOpen)
  };
  const handleItemClick = (e: any, label: string) => {
    selectedItem !== e.target.id && setSelectedItem(e.target.id);
    queryPushing && queryPushing(label)
    toggleDropdown();
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(true)}>
      {/*false*/}
      <div className={`${styles['dropdown']} ${isOpen && styles['open']} ${className ? styles[className] : ''}`}>
        <div className={styles['header']} onClick={toggleDropdown} >
          <span className='min-w-max ml-2'>
            {icon && <picture>
              <img
                src={icon}
                alt="button"
                className={'location h-4 w-4 '}
              />
            </picture>}
            {/*  @ts-ignore */}
            {selectedItem ? items && items?.find(item => item.id == selectedItem)?.label : headerTitle}
          </span>
          <div className='w-full p-1'>
            <Image src={arrowIcon} alt="arrow" className={`${styles['icon']} ${isOpen && styles["open"]}`} />
          </div>
          <IconButton
            onClick={() => {
              queryPushing && queryPushing("")
              setSelectedItem(undefined)
              setOpen(true);
            }}
          >
            {/*false*/}
            <IoIosClose />
          </IconButton>
        </div>
        <div className={`${styles['body']} ${isOpen && styles['open']}`}>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {/*  @ts-ignore */}
              <div className={styles["item"]} onClick={e => handleItemClick(e, item.label)} id={item.id}>
                <span className={`${styles['dot']} ${item.id == selectedItem && styles['selected']}`}>• </span>
                {item.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default Dropdown;



