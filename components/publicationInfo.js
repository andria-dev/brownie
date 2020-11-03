import React from 'react'

export function PublicationInfo({ date, formattedDate, timeToRead }) {
	return (
		<>
			<time dateTime={date}>{formattedDate}</time>{' '}
			<span aria-hidden="true">·</span> <span>{`${timeToRead} min read`}</span>
		</>
	)
}
