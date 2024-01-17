import Link from 'next/link'
import { memo } from 'react'

const ComponentCardBox = ({
  title,
  titleColor,
  linkMore,
  children,
  icon,
  className,
}) => {
  return (
    <div className={`h-auto w-full ${className}`}>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2'>
          {icon}
          <h2 className='text-xl' style={{ color: titleColor }}>
            {title}
          </h2>
        </div>
        {linkMore && (
          <Link href={`${linkMore}`}>
            <p>View All</p>
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

export default memo(ComponentCardBox)
