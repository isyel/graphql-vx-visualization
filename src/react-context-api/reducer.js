import * as types from "./actionTypes";

export const initialState = {
	authors: [],
	postsOfTheMonth: [],
	authorMonthlyPosts: [],
};

//

const reducer = (state, action) => {
	switch (action.type) {
		case types.SET_AUTHORS:
			return {
				...state,
				authors: action.authors,
			};
		case types.SET_AUTHORS_MONTHLY_POSTS:
			return {
				...state,
				authorMonthlyPosts: action.authorMonthlyPosts,
			};
		case types.SET_POSTS_PER_MONTH:
			return {
				...state,
				postsOfTheMonth: action.postsOfTheMonth,
			};
		default:
			return state;
	}
};

export default reducer;
