import React from 'react';
import {LinkType} from "../utils/types";

type LinkProps = {
    link:LinkType;
}

const Link = ({link}:LinkProps) => {

    return (
        <div>
            <div>
                {link.description} ({link.url})
            </div>
        </div>
    );
};

export default Link;