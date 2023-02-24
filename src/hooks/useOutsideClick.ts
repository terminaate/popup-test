import {RefObject, useCallback, useEffect, useRef} from "react";

export default <T extends HTMLElement>(
    then: () => void,
    event: 'mousedown' | 'mouseup' | 'click' = 'mousedown',
    except?: RefObject<HTMLElement>,
) => {
    const ref = useRef<null | T>(null);

    const handler = useCallback((e: MouseEvent) => {
        const {target} = e as MouseEvent & { target: HTMLElement };
        if (null === ref.current) {
            return;
        }

        if (!ref.current?.contains(target) && !except?.current?.contains(target)) {
            then();
        }
    }, []);

    useEffect(() => {
        window.addEventListener(event, handler);

        return () => window.removeEventListener(event, handler);
    }, [])

    return ref;
};