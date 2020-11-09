import React from 'react'

export function PublicationInfo({date, timeToRead}) {
	return (
		<>
			<time dateTime={new Date(date)}>{date}</time>{' '}
			<span aria-hidden="true">·</span> <span>{timeToRead}</span>
		</>
	)
}
