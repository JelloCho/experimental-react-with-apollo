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
          {data.feed.links.map((link:LinkType,index:number) => (
            <Link key={link.id} {...link} index={index}/>
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;