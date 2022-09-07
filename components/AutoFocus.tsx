import { useRef, useEffect, FunctionComponent, HTMLAttributes } from 'react'

const AutoFocus: FunctionComponent<
  {
    as: keyof JSX.IntrinsicElements
  } & HTMLAttributes<HTMLElement>
> = ({ as: Wrapper = 'div', children, ...rest }) => {
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollIntoView()
      ref.current?.focus()
    }
  }, [])

  return (
    // @ts-ignore
    <Wrapper {...rest} ref={ref}>
      {children}
    </Wrapper>
  )
}

export default AutoFocus
