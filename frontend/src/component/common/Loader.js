import React from 'react';
import './loader.css';
import { Grid } from  'react-loader-spinner'

const LoaderModal = () => {
    return (
        <div className="loader-modal">
            <div className="loader-content">
                <Grid
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        </div>
    );
};

export default LoaderModal;