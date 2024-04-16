import { logoutHandler } from "@/utils/helper";
import accountIcon from "/icons/account.svg";
import logoutIcon from "/icons/logout.svg";

const Aside = () => {
  return (
    <aside className="bg-[#00000026] w-28 fixed left-0 bottom-0 top-0">
      <div className="flex flex-col justify-between items-center py-4 h-full">
        <img src={accountIcon} alt="main-bg" className="h-5 w-5 flex" />

        <h2 className="text-4xl rotate-[270deg] text-white min-w-64">
          Норма Выхода
        </h2>

        <button className="h-5 w-5" onClick={logoutHandler}>
          <img src={logoutIcon} alt="logout" />
        </button>
      </div>
    </aside>
  );
};

export default Aside;
