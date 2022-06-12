import React, { useEffect, useState } from "react";
import { Select as AntSelect, SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { BaseSelectRef } from "rc-select";

const SECRET_COMBOBOX_MODE_DO_NOT_USE = "SECRET_COMBOBOX_MODE_DO_NOT_USE";

type OmitOptionsSelectProps<ValueType> = Omit<SelectProps<ValueType>, "options">;
type OptionsFuncType<OptionType extends DefaultOptionType = DefaultOptionType> =
  () => Promise<OptionType[]>;
interface ExtOptionsProps<
  OptionType extends DefaultOptionType = DefaultOptionType
> {
  options: OptionType[] | OptionsFuncType<OptionType>;
}

type ExtSelectProps<ValueType = any, OptionType extends DefaultOptionType = DefaultOptionType>  = OmitOptionsSelectProps<ValueType> & ExtOptionsProps<OptionType>
const _Select = <ValueType = any, OptionType extends DefaultOptionType = DefaultOptionType>(
  props:ExtSelectProps
) => {
  const { children, options, ...rest } = props;
  const [_options, setOptions] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    if (typeof options === "function") {
      options().then((data) => setOptions(data));
    }
  }, [options]);
  return (
    <AntSelect
      options={typeof options === "function" ? _options : options}
      {...rest}
    >
      {children}
    </AntSelect>
  );
};

const Select = React.forwardRef(_Select) as unknown as (<
  ValueType = any,
  OptionType extends DefaultOptionType = DefaultOptionType
>(
  props: React.PropsWithChildren<ExtSelectProps<ValueType, OptionType>> & {
    ref?: React.Ref<BaseSelectRef>;
  }
) => React.ReactElement) & {
  SECRET_COMBOBOX_MODE_DO_NOT_USE: string;
  Option: typeof AntSelect.Option;
  OptGroup: typeof AntSelect.OptGroup;
};

Select.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;

export { Select };
