import React, {FC} from 'react';
import { Feed, LinkType } from '../utils/types';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils/util';
import { useMutation } from '@apollo/client';
import { VOTE_MUTATION } from '../utils/mutations';
import { FEED_QUERY, FEED_QUERY_RESULT } from '../utils/queries';

interface LinkProps extends LinkType {
  index:number;
}


const Link :FC<LinkProps>= ({id,index,description,url,votes,postedBy,createdAt}) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [vote] = useMutation(VOTE_MUTATION,{
    variables:{
      linkId:id
    },
    update(cache, { data: { vote } }) {
      const { feed }: FEED_QUERY_RESULT= cache.readQuery<FEED_QUERY_RESULT>({
        query: FEED_QUERY
      })!;

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        }
      });
  }});

  // const take = LINKS_PER_PAGE;
  // const skip = 0;
  // const orderBy = { createdAt: 'desc' };

    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{index + 1}.</span>
          {authToken && (
            <div
              className="ml1 gray f11"
              style={{ cursor: 'pointer' }}
              onClick={()=>vote()}
            >
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          <div>
            {description} ({url})
          </div>
          {authToken && (
            <div className="f6 lh-copy gray">
              {votes.length} votes | by{' '}
              {postedBy ? postedBy.name : 'Unknown'}
              {timeDifferenceForDate(createdAt)}
            </div>
          )}
        </div>
      </div>
    );
};

export default Link;