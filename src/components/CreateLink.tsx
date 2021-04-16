import React, { useState } from 'react';
import {useMutation} from "@apollo/client";
import {CREATE_LINK_MUTATION} from "../utils/mutations";
import {useHistory} from 'react-router';
import { FEED_QUERY, FEED_QUERY_RESULT } from '../utils/queries';

const initialState = {
	description: '',
	url: ''
}

const CreateLink = () => {
	const [formState, setFormState] = useState(initialState);

	const history = useHistory();
	const [createLink] = useMutation(CREATE_LINK_MUTATION, {
		variables: {
			description: formState.description,
			url: formState.url
		},
		update: (cache, { data: { post } }) => {
			// const take = LINKS_PER_PAGE;
			// const skip = 0;
			// const orderBy = { createdAt: 'desc' };

			const {feed}:FEED_QUERY_RESULT = cache.readQuery<FEED_QUERY_RESULT>({
				query: FEED_QUERY,
				// variables: {
				//   take,
				//   skip,
				//   orderBy
				// }
			})!;

			cache.writeQuery({
				query: FEED_QUERY,
				data: {
					feed: {
						links: [post, ...feed.links]
					}
				},
				// variables: {
				//   take,
				//   skip,
				//   orderBy
				// }
			});
		},
		onCompleted:()=>history.push('/')
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createLink().then(r => console.log(r)).catch(e=>console.log(e));
				}}
			>
				<div className="flex flex-column mt3">
					<input
						className="mb2"
						value={formState.description}
						onChange={(e) =>
							setFormState({
								...formState,
								description: e.target.value
							})
						}
						type="text"
						placeholder="A description for the link"
					/>
					<input
						className="mb2"
						value={formState.url}
						onChange={(e) =>
							setFormState({
								...formState,
								url: e.target.value
							})
						}
						type="text"
						placeholder="The URL for the link"
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default CreateLink;