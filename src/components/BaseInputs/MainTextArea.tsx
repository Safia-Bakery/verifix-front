import { ChangeEvent, FC, KeyboardEventHandler } from "react";
import cl from "classnames";
import styles from "./index.module.scss";
import { UseFormRegisterReturn } from "react-hook-form";
interface Props {
  onChange?: (val: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  value?: string;
  placeholder?: string | null;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  onKeyDown?: KeyboardEventHandler;
  autoFocus?: boolean;
}

const MainTextArea: FC<Props> = ({
  className,
  placeholder = "Комментарии",
  register,
  ...others
}) => {
  return (
    <textarea
      className={cl(className, styles.inputBox)}
      rows={4}
      placeholder={placeholder || ""}
      {...register}
      {...others}
    />
  );
};

export default MainTextArea;
