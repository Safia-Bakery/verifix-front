import { FC, FocusEventHandler, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import { useState } from "react";
import { DivisionTypes, SelectValue } from "@/utils/types";

interface Props {
  enabled?: boolean;
  placeholdeer?: string;
  autoFocus?: boolean;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  isLoading?: boolean;
  data?: DivisionTypes["timesheets"];
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
    if (data)
      $items((prev) => [
        ...prev,
        ...data?.map((item) => ({ value: item.id, label: item.name })),
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
