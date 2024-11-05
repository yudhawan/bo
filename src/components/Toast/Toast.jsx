import IconComponent from "@/components/IconComponent/IconComponent";
import style from "./Toast.module.scss";
import PropTypes from "prop-types";
import IconSuccess from "@/icons/update-status.svg";
import IconDanger from "@/icons/Info.svg";
import IconClose from "@/icons/silang.svg";
import toast from "@/store/zustand/toast";

const Toast = ({ classname, type, children = "Toast", onclick }) => {
  const { showToast } = toast();

  // kalau jadi ada timer untuk close popup, nyalakan fungsi dibawah + pasang state sesuai kondisinya
  // useEffect(() => {
  //   if (show) {
  //     const timer = setTimeout(() => {
  //       onclick();
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [show, onclick]);

  return (
    <>
      <div
        className={`flex gap-[4px] items-center justify-between w-[440px] h-fit leading-[14.4px] font-semibold text-[12px] rounded-[6px] py-[15px] px-[12px] border text-neutral-900 fixed bottom-[75px] right-[25px] transform transition-all duration-500 ease-in-out ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } ${
          type == "success"
            ? "bg-success-50 border-success-400"
            : "bg-error-50 border-error-400"
        } ${classname}`}
      >
        <div className="flex items-center w-[380px] gap-[12px]">
          <div className="w-5">
            <IconComponent
              src={type === "success" ? IconClose : IconClose}
              height={20}
              width={20}
              classname={
                (type = "success" ? style.fill_success : style.fill_danger)
              }
            />
          </div>
          {children}
        </div>
        <IconComponent
          src={IconClose}
          height={20}
          width={20}
          classname="cursor-pointer"
          onclick={onclick}
        />
      </div>
    </>
  );
};

export default Toast;

Toast.prototype = {
  classname: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.string,
  onclick: PropTypes.func,
};
