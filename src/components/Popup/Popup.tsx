import React, {FC, RefObject, useEffect, useState} from 'react';
import useOutsideClick from "../../hooks/useOutsideClick";
import cl from "./Popup.module.scss";
import {AnimatePresence, HTMLMotionProps, motion} from 'framer-motion';
import {createPortal} from "react-dom";

interface IPopup extends HTMLMotionProps<"div"> {
    containerRef: RefObject<HTMLElement>;
    event?: "mousedown" | "mouseup" | "click";
}

const calculateTop = (initialTop: number, initialHeight: number) => {
    return (initialTop + initialHeight / 2) + initialHeight / 10;
}

const Popup: FC<IPopup> = ({containerRef, children, className, event="click", ...props}) => {
    const [visible, setVisible] = useState(false);
    const [top, setTop] = useState<number>(0);
    const [left, setLeft] = useState<number>(0);

    const closePopup = () => {
        setVisible(false)
    }

    const ref = useOutsideClick<HTMLDivElement>(closePopup, event, containerRef)

    useEffect(() => {

        const updatePosition = () => {
            const rect = containerRef.current?.getBoundingClientRect()!;
            setTop(calculateTop(rect.y / 2, rect.height));
            setLeft(rect.left)
        }

        updatePosition()

        window.addEventListener("resize", updatePosition)

        const handler = () => {
            setVisible(prev => !prev);
        }
        containerRef.current?.addEventListener(event, handler)

        return () => {
            containerRef.current?.removeEventListener(event, handler)
            window.removeEventListener("resize", updatePosition);
        }
    }, [])

    return createPortal((
        <AnimatePresence>
            {visible && (
                <motion.div transition={{duration: 0.15}} initial={{y: top - 10, opacity: 0}}
                            animate={{y: top, opacity: 1}}
                            exit={{y: top - 10, opacity: 0}}
                            onClick={closePopup} ref={ref}
                            style={{
                                top,
                                left
                            }}
                            className={`${cl.popupContainer} ${className}`} {...props}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    ), document.querySelector("#popups")!);
};

export default Popup;