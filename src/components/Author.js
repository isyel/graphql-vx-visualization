import React from "react";
import { Link } from "react-router-dom";

function Author({ author, posts }) {
	return (
		<>
			<div className="bg-gray-200 my-5 p-2 rounded-lg grid grid-cols-5">
				<div className="md:col-span-3 col-span-5 flex justify-items-start items-center md:pl-6 p-2">
					<img
						className="rounded-full w-12"
						src="/avatar.jpg"
						alt="author-avatar"
					/>
					<div className="justify-start flex flex-col justify-items-start pl-3">
						<h1 className="font-semibold">
							{author.firstName} {author.lastName}
						</h1>
						<p className="text-sm	">
							<span className="font-semibold">Latest Post: </span>
							<span className="text-gray-700">{posts[0].title}</span>
						</p>
					</div>
				</div>
				<div className="md:col-span-2 col-span-5 items-center flex p-2 flex-row justify-evenly align-middle border-t-2 border-gray-300 md:border-0">
					<div className=" pb-2">
						<span className="text-xl">{posts.length}</span> posts
					</div>
					<div className="flex flex-row justify-around">
						<Link
							to={`/profile/${author.id}`}
							className="py-2 px-3 rounded-md bg-gray-900 text-white justify-around flex">
							See Profile
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

export default Author;
