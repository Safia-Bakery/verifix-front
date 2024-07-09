import { FC, FocusEventHandler, useEffect } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { useState } from "react";
import { DivisionTypes, SelectValue } from "@/utils/types";

interface Props {
  enabled?: boolean;
  placeholdeer?: string;
  autoFocus?: boolean;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  isLoading?: boolean;
  data?: DivisionTypes["schedules"];
  onChange?: (val: MultiValue<SelectValue>) => void;
  onMenuScrollToBottom?: () => void;
  value?: SelectValue[] | undefined;
}

const CustomReactSelect: FC<Props> = ({
  placeholdeer = "",
  autoFocus = false,
  onFocus,
  data,
  isLoading,
  onChange,
  onMenuScrollToBottom,
  value,
}) => {
  const [items, $items] = useState<SelectValue[]>([]);

  const handleChange = (selectValue: MultiValue<SelectValue>) => {
    if (selectValue) onChange?.(selectValue);
  };

  useEffect(() => {
    const items = data ? Object.entries(data) : [];
    if (items)
      $items((prev) => [
        ...prev,
        ...items.map((item) => {
          return {
            value: item?.[0],
            label: item?.[1],
          };
        }),
      ]);
  }, [data]);

  return (
    <Select
      options={items}
      isLoading={isLoading}
      onChange={handleChange}
      className="z-50 min-w-40 max-w-96 w-full"
      isClearable
      isMulti
      value={value}
      autoFocus={autoFocus}
      onFocus={onFocus}
      placeholder={placeholdeer}
      onMenuScrollToBottom={onMenuScrollToBottom}
    />
  );
};

export default CustomReactSelect;
