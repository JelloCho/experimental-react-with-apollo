import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import Link from './Link';
import { FEED_SEARCH_QUERY } from '../utils/queries';
import { LinkType } from '../utils/types';

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery(
    FEED_SEARCH_QUERY,
  );

  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter },
            })
          }
        >
          OK
        </button>
      </div>
      {data &&
        data.feed.links.map(
          (link: LinkType, index: number) => (
            <Link key={link.id} {...link} index={index} />
          ),
        )}
    </>
  );
};

export default Search;
