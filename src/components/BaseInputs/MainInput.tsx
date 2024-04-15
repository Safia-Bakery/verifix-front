import {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  onFocus?: () => void;
  ref?: any;
  defaultValue?: any;
  onKeyDown?: KeyboardEventHandler;
}

const MainInput: FC<Props> = ({
  className = "",
  placeholder = "",
  register,
  ref,
  defaultValue,
  ...others
}) => {
  return (
    <input
      className={`${className} ${styles.inputBox}`}
      placeholder={placeholder || ""}
      ref={ref}
      defaultValue={defaultValue}
      {...register}
      {...others}
    />
  );
};

export default MainInput;
