import * as types from "./actionTypes";

export const initialState = {
	authors: [],
	topPostsOfTheMonth: [],
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
		case types.SET_TOP_POSTS:
			return {
				...state,
				topPostsOfTheMonth: action.topPosts,
			};
		default:
			return state;
	}
};

export default reducer;