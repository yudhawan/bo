import Loading from "@/components/Loading/Loading";
import LoginValidation from "./LoginValidation/LoginValidation";
import PemberitahuanPerubahan from "./PemberitahuanPerubahan/PemberitahuanPerubahan";

export const listModalComponents = [
  {
    id: "login_validation_error",
    component: LoginValidation,
  },
  {
    id:'pemberitahuan',
    component:PemberitahuanPerubahan
  },
  {
    id:'loading',
    component:Loading
  },
];
