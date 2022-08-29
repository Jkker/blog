const TagItemMini = ({ tag, selected = false }) => {
  return (
    <span
      className={`cursor-pointer inline-block rounded  duration-200 py-0.5 px-1 text-xs whitespace-nowrap text-gray-600 dark:text-gray-200
       notion-item-${tag.color ?? 'gray'}`}
    >
      <div className='font-light'>
        {selected && <span className='mr-1 fa-tag' />}
        {tag.name}
      </div>
    </span>
  )
}

export default TagItemMini
