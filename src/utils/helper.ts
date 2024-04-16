import useQueryString from "@/hooks/custom/useQueryString";
import { QueryClient } from "@tanstack/react-query";

export enum EPresetTimes {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  TEN_DAYS = DAY * 10,
}
export const itemsPerPage = 50;

export const tokenValue = "verifix_token";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: EPresetTimes.MINUTE * 10,
      staleTime: EPresetTimes.MINUTE * 5,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export const numberWithCommas = (val: number) => {
  return val
    ?.toFixed(2)
    ?.toString()
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const handleIdx = (index: number) => {
  const currentPage = Number(useQueryString("page")) || 1;
  return currentPage === 1
    ? index + 1
    : index + 1 + itemsPerPage * (currentPage - 1);
};
export const dateTimeFormat = "DD.MM.YYYY HH:mm";
export const dateMonthYear = "DD.MM.YYYY";
export const yearMonthDate = "YYYY-MM-DD";

export const replacer = (inputDate: string) => {
  const [year, month, day] = inputDate.split("-");
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

export const logoutHandler = () => {
  localStorage.removeItem(tokenValue);
  window.location.reload();
};
