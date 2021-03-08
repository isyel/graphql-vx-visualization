import React from "react";

function VisualCard({ children, props }) {
	return <div className="dark-card md:col-span-1 col-span-2">{children}</div>;
}

export default VisualCard;
