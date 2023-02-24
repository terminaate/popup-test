import {useRef} from "react";
import Popup from "./components/Popup";
import cl from "./App.module.scss";
import {BsThreeDotsVertical} from "react-icons/all";

const buttons = ["First button", "Second button", "Third button", "Fourth button"]

const App = () => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    return (
        <div className={cl.appContainer}>
            <button className={cl.button} ref={buttonRef}><BsThreeDotsVertical/></button>
            <Popup containerRef={buttonRef}>
                {buttons.map((text, key) => (
                    <button key={key} className={cl.popupButton}>{text}</button>
                ))}
            </Popup>
        </div>
    );
};

export default App;