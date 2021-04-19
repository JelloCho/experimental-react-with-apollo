import Link from './Link';
import { Feed, LinkType } from '../utils/types';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from '../utils/queries';
import { LINKS_PER_PAGE } from '../utils/constants';
import { useHistory } from 'react-router';
import {
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION,
} from '../utils/subscription';
import { getQueryVariables } from '../utils/util';

const getLinksToRender = (
  isNewPage: boolean,
  feed: Feed,
) => {
  if (isNewPage) {
    return feed.links;
  }
  const rankedLinks = feed.links.slice();
  rankedLinks.sort(
    (l1: LinkType, l2: LinkType) =>
      l2.votes.length - l1.votes.length,
  );
  return rankedLinks;
};

const LinkList = () => {
  const history = useHistory();
  const isNewPage = history.location.pathname.includes(
    'new',
  );
  const pageIndexParams = history.location.pathname.split(
    '/',
  );
  const page = parseInt(
    pageIndexParams[pageIndexParams.length - 1],
  );

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const {
    data,
    loading,
    error,
    subscribeToMore,
  } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  });

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({ id }: LinkType) => id === newLink.id,
      );
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      });
    },
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION,
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && (
        <>
          {getLinksToRender(isNewPage, data.feed).map(
            (link: LinkType, index: number) => (
              <Link
                key={link.id}
                {...link}
                index={index + pageIndex}
              />
            ),
          )}
          {isNewPage && (
            <div className="flex ml4 mv3 gray">
              <div
                className="pointer mr2"
                onClick={() => {
                  if (page > 1) {
                    history.push(`/new/${page - 1}`);
                  }
                }}
              >
                Previous
              </div>
              <div
                className="pointer"
                onClick={() => {
                  if (
                    page <=
                    data.feed.count / LINKS_PER_PAGE
                  ) {
                    const nextPage = page + 1;
                    history.push(`/new/${nextPage}`);
                  }
                }}
              >
                Next
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LinkList;
