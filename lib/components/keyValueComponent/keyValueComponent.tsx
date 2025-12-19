import React from 'react';
import styles from "./keyValue.module.scss"
import { KayValueDataType } from "@/lib/types/componentTypes";
interface KeyValueProps {
  data: KayValueDataType[]
  minWidth?: string
}
const KeyValueComponent: React.FC<KeyValueProps> = ({ data, minWidth }) => {
  return (
    <div className={styles["key-value-container"]}>
      {data.map((item, index) =>
        <div key={index} className={styles["key-value-wrapper"]} style={{ minWidth: minWidth || "unset", maxWidth: minWidth && "unset" }}>
          <p className={styles["key"]}>{`${item.key} :`}</p>
          <p className={styles["value"]}>{item.value}</p>
        </div>
      )}

    </div>
  );
};

export default KeyValueComponent;