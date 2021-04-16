import React from 'react';
import Link from './Link';
import {LinkType} from "../utils/types";
import {useQuery} from "@apollo/client";
import {FEED_QUERY} from "../utils/queries";


const LinkList = () => {
    const { data } = useQuery(FEED_QUERY);

    console.log(data)

    return (
        <div>
            {data && (
                <>
                    {data.feed.links.map((link:LinkType) => (
                        <Link key={link.id} {...link} />
                    ))}
                </>
            )}
        </div>
    );
};

export default LinkList;