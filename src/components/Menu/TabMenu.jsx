import { Fragment, useRef } from "react";
import { useRouter } from "next/navigation";
import menuZus from "../../store/zustand/menu";

const TabMenu = ({ menu, onclick }) => {
  const router = useRouter();
  const { setMenuZ, menuZ } = menuZus();
  const tabRef = useRef(null);

  const handleSelected = (e, key) => {
    e.preventDefault;
    setMenuZ({ id: key.id, value: key.name });
    tabRef.current.scrollIntoView({ behavior: "smooth" });
    router.push(`?tab=${key.id}`);
    // window.scrollTo(0,tabRef.current.offsetTop)

    onclick;
  };

  return (
    <div className="flex flex-wrap gap-2" ref={tabRef}>
      {menu.map((key, index) => {
        return (
          <Fragment key={key.id}>
            {index > 0 && <div className="border-l border-l-neutral-400"></div>}
            <div
              className={`px-6 py-3 text-base cursor-pointer ${
                menuZ?.value === key.name
                  ? "font-bold text-primary-700 border-b border-b-primary-700"
                  : "font-semibold text-neutral-900"
              }`}
              onClick={(e) => handleSelected(e, key)}
            >
              {key.name}{" "}
              {key.notif && `(${key.notif >= 100 ? "99+" : key.notif})`}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default TabMenu;
