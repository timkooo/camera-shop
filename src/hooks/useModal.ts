import { useEffect, useState } from 'react';

export const useModal = ( isVisible : boolean = false) => {

  const [modalVisible, setModalVisible] = useState(isVisible);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  }

  useEffect(() => {
    modalVisible
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [modalVisible]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setModalVisible(false);
      }
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return [ modalVisible, toggleModal ] as const;
}