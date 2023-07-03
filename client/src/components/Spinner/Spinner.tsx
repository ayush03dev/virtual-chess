import { ClipLoader } from "react-spinners";
import React from "react";

const Spinner = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <ClipLoader color={"#ff79c6"} loading={true} size={100} />
        </div>
    );
};

export default Spinner;