'use client'

export default function RatingStars({ rating = 0 }) {

  const stars = [1,2,3,4,5]

  return (
    <div className="flex items-center gap-1 text-yellow-500">

      {stars.map((star) => (

        <span key={star}>
          {rating >= star ? '★' : '☆'}
        </span>

      ))}

      <span className="text-gray-500 text-sm ml-1">
        ({rating.toFixed(1)})
      </span>

    </div>
  )
}