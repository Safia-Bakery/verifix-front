import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import Button from "@/components/Button";
import Loading from "@/components/Loader";
import loginMutation from "@/hooks/mutations/login";
import bg from "/images/login-bg.png";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { tokenValue } from "@/utils/helper";

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem(tokenValue);
  const [error, $error] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = loginMutation();

  const onSubmit = () => {
    const { username, password } = getValues();

    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          localStorage.setItem(tokenValue, data.access_token);
          if (error) $error(false);
        },
        onError: () => $error(true),
      }
    );
  };

  useEffect(() => {
    if (token) navigate("/home");
  }, [token]);

  return (
    <div className="h-screen flex flex-1 w-screen relative">
      <img
        src={bg}
        alt="bg-image"
        className="absolute inset-0 -z-10 w-full h-full"
      />
      <div className="flex flex-[4] items-center justify-center bg-lightBrown opacity-65">
        <img
          src="/images/safia-img.png"
          className="max-h-[21vh] max-w-[12vw] h-full w-full object-contain"
          alt="safia-logo"
        />
      </div>

      <div className="flex flex-[3] flex-col justify-between items-center py-8">
        <div />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1 max-w-[24vw] w-full"
        >
          <h3 className="text-3xl font-bold mb-1 text-white">{"Вход"}</h3>
          <BaseInput error={errors.login}>
            <MainInput
              placeholder={"Логин"}
              register={register("username", {
                required: "Обязательное поле",
              })}
            />
          </BaseInput>
          <BaseInput error={errors.password}>
            <MainInput
              placeholder={"Пароль"}
              type="password"
              register={register("password", { required: "Обязательное поле" })}
            />
          </BaseInput>
          {error && (
            <p className={"text-sm text-red-400"}>
              {"Неправильное имя пользователя или пароль."}
            </p>
          )}

          <Button className="!bg-lightBrown" type="submit">
            {"Логин"}
          </Button>
        </form>

        <div className="max-w-[24vw] w-full">
          <p className="text-lg leading-5 text-textColor">
            Если у вас нет доступа к этой системе, пожалуйста обратитесь к
            системному администратору вашей компании
          </p>
        </div>
      </div>

      {isPending && <Loading />}
    </div>
  );
};

export default Login;
