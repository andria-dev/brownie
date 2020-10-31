import React from 'react'

function PublicationInfo({ date, formattedDate, timeToRead }) {
	return (
		<>
			<time dateTime={date}>{formattedDate}</time>{' '}
			<span aria-hidden="true">·</span> <span>{`${timeToRead} min read`}</span>
		</>
	)
}

export default PublicationInfo
