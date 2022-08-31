import cx from 'clsx'

const Select = ({
  value,
  onChange,
  name,
  label,
  className = '',
  placeholder = '',
  options,
  disabled = false,
  ...props
}) => (
  <fieldset
    className={cx(
      {
        'cursor-not-allowed': disabled,
      },
      className
    )}
  >
    <label
      htmlFor={name}
      className={cx('text-sm text-black dark:text-gray-200', {
        'opacity-40 cursor-not-allowed': disabled,
      })}
    >
      {label}
    </label>
    <select
      name={name}
      aria-label={label}
      className='input'
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      id={name}
      disabled={disabled}
      {...props}
    >
      {options.map((value) =>
        typeof value === 'string' ? (
          <option key={value} value={value}>
            {value}
          </option>
        ) : (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        )
      )}
    </select>
  </fieldset>
)

export default Select
