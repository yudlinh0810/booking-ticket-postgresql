import React, { ReactNode } from "react";
import { Modal } from "antd";
import styles from "../styles/components/modal.module.scss";

interface CustomModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode[];
  width?: number; // %
  height?: number; // vh
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  children,
  onCancel,
  width = 80,
  height = 90,
}) => {
  return (
    <Modal
      width={`${width}%`}
      open={open}
      title={title}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      centered
    >
      <div className={styles["modal-content-scrollable"]} style={{ maxHeight: `${height}` }}>
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
