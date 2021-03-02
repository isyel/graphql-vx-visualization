import React from "react";
import { Link } from "react-router-dom";

function Author({ author, posts }) {
	return (
		<>
			<div className="bg-gray-200 mx-2 my-4 p-2 rounded-lg grid grid-cols-4">
				<div className="col-span-3 flex justify-items-start items-center">
					<img
						src="https://s3.amazonaws.com/uifaces/faces/twitter/jacobbennett/128.jpg"
						alt="author-avatar"
					/>
					<div className="justify-start flex flex-col justify-items-start pl-3">
						<h1 className="font-semibold">
							{author.firstName} {author.lastName}
						</h1>
						<p>
							Latest Post:{" "}
							<span className="text-gray-700">{posts[0].title}</span>
						</p>
						<Link
							to={`/profile/${author.id}`}
							className="py-2 px-3 rounded-md bg-gray-900 text-white md:hidden justify-around flex">
							See Profile
						</Link>
					</div>
				</div>
				<div className="col-span-1 items-center content-center place-items-center flex flex-col md:flex-row align-middle">
					<div className="pr-6">
						<span className="text-xl">{posts.length}</span> posts
					</div>
					<Link
						to={`/profile/${author.id}`}
						className="py-2 px-3 rounded-md bg-gray-900 text-white hidden md:block">
						See Profile
					</Link>
				</div>
			</div>
		</>
	);
}

export default Author;
