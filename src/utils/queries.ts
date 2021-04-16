import {gql} from "@apollo/client";
import { Feed } from './types';

export const FEED_QUERY = gql`
    {
        feed {
            id
            links {
                id
                createdAt
                url
                description
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`;

export type FEED_QUERY_RESULT={
    feed:Feed;
}