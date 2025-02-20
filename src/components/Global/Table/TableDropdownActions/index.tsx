import React, { RefObject, useEffect, useRef } from "react";
import { TableDropdownActionProp } from "./types";
import { EllipsesVertical as ActionIcon } from "src/assets/icons/icons";
import useClickOutside from "src/hooks/useClickOutside";
import styles from "./_styles.module.scss";
import Button from "components/Core/Button";


const TableDropdownActions: React.FC<TableDropdownActionProp> = ({ actions }) => {
  const { open, setOpen, dropdownRef } = useClickOutside();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setOpen(!open);
    // scrollToContent()
  };

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: "center" });
    }
  }, [open]);

  return (
    <div
      ref={dropdownRef as RefObject<HTMLDivElement>}
      className={styles.dropdown_action}
    >
      <Button
        variant={"transparent"}
        width={"fit"}
        size={"small"}
        icon={<ActionIcon size={12} />}
        onClick={handleToggleDropdown}
      />

      {actions.length > 0 && open && (
        <div
          ref={open? contentRef : null}
          className={`${styles.content} ${open ? styles.active : ""}`}
        >
          {actions.map((item, index)=> {
            if (item.show === false) {
              return null;
            }

            return item.customComponent??
            (
                <button key={index} className={styles.actionButton} onClick={()=> { item.onClick(item); setOpen(false); }}>
                    {item.icon??""}
                    <p>{item.label}</p>
                </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default TableDropdownActions;
