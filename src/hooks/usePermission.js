import { useSelector } from "react-redux";

export const usePermissions = () => {
  return useSelector(state => state.auth.permissions || []);
};
