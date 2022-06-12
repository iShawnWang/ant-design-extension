import React, {useState, useCallback} from 'react'
import { Button as AntButton } from 'antd'
import type { ButtonProps } from 'antd'

function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

interface CompoundedComponent extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
  Group: typeof AntButton.Group;
  __ANT_BUTTON: boolean;
}

const _Button = (props: ButtonProps) => {
  const [innerLoading, setInnerLoading] = useState(false)
  const {children, onClick, loading, ...rest} = props

  const _onClick: React.MouseEventHandler<HTMLElement> = useCallback((event) => {
    const returnValue = onClick?.(event)
    if(returnValue && isPromise(returnValue)){
      setInnerLoading(true);
      (returnValue as Promise<any>).finally(() => setInnerLoading(false))
    }
  }, [onClick])

  return <AntButton loading={loading || innerLoading} onClick={_onClick} {...rest}>{children}</AntButton>
}

const Button = React.forwardRef<unknown, ButtonProps>(_Button) as CompoundedComponent;

Button.displayName = 'ext-Button';
Button.Group = AntButton.Group;
Button.__ANT_BUTTON = true;

export {Button}