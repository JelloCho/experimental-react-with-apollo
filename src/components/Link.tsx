import React, {FC} from 'react';
import {LinkType} from "../utils/types";

const Link :FC<LinkType>= ({url,description}) => {

    return (
        <div>
            <div>
                {description} ({url})
            </div>
        </div>
    );
};

export default Link;