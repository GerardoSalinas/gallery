

import "./skeleton.css";
import { useEffect, useState } from "react";

export default function Skeleton (){
    const [items, setItems] = useState<Array<any>>([]);

    useEffect(() => {
        const heights = ['40vh', '45vh', '65vh', '35vh', '50vh'];
        const listItems = [];

        for (let index = 0; index < 12; index++) {
            listItems.push(
            <div 
                className={`mb-4 break-inside-avoid skeleton-image rounded-lg`} 
                key={index}
            />
            );
        }

        setItems(listItems);
    }, []);
    return (
        <>
            {
                items
            }
        </>
    );
}