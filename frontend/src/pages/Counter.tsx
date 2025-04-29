import { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className='card'>
                <h1>Profile</h1>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
        </>
    );
};

export default Counter;
